import { NextRequest } from "next/server";
import { ok, fail, requireAdmin } from "@/lib/api";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const ALLOWED_IMAGE = /^image\/(png|jpe?g|webp|gif|avif)$/;
const ALLOWED_AUDIO = /^audio\/(mpeg|mp3|ogg|wav|m4a|aac|webm)$/;
const MAX_SIZE = 25 * 1024 * 1024;

function extFrom(name: string, mime: string) {
  const e = path.extname(name).toLowerCase();
  if (e && (e === ".jpg" || e === ".jpeg" || e === ".png" || e === ".webp" || e === ".gif" || e === ".avif" || e === ".mp3" || e === ".ogg" || e === ".wav" || e === ".m4a" || e === ".aac" || e === ".webm")) {
    return e;
  }
  return mime.startsWith("audio/") ? ".mp3" : ".jpg";
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const form = await req.formData();
    const isFileLike = (v: FormDataEntryValue): v is File =>
      typeof v === "object" &&
      "arrayBuffer" in v &&
      "name" in v &&
      "type" in v &&
      "size" in v;
    const files = Array.from(form.values()).filter(isFileLike);
    if (files.length === 0) return fail("no_file");

    const urls: string[] = [];
    for (const file of files) {
      if (file.size > MAX_SIZE) return fail("file_too_large");
      const isImage = ALLOWED_IMAGE.test(file.type);
      const isAudio = ALLOWED_AUDIO.test(file.type);
      if (!isImage && !isAudio) return fail("unsupported_type");

      const buffer = Buffer.from(await file.arrayBuffer());
      const kind = isAudio ? "audio" : "img";
      const name = `${kind}-${Date.now()}-${crypto.randomBytes(5).toString("hex")}${extFrom(file.name, file.type)}`;
      const pathname = `uploads/${name}`;

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(pathname, buffer, {
          access: "public",
          addRandomSuffix: false,
        });
        urls.push(blob.url);
      } else {
        const dir = path.join(process.cwd(), "public", "uploads");
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, name), buffer);
        urls.push(`/uploads/${name}`);
      }
    }

    return ok({ urls });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "upload_failed", 500);
  }
}
