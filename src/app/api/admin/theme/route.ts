import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson, requireAdmin } from "@/lib/api";
import { sanitizePalette, DEFAULT_PALETTE, PRESETS, Palette } from "@/lib/siteTheme";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const row = await prisma.siteTheme.findUnique({ where: { id: 1 } });
  const palette = (row?.palette as Palette | null) ?? DEFAULT_PALETTE;
  return ok({ palette, presets: PRESETS });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = parseJson<{ palette?: unknown }>(await req.text());
  const palette = sanitizePalette(body?.palette);
  if (!palette) return fail("invalid_palette");

  await prisma.siteTheme.upsert({
    where: { id: 1 },
    create: { id: 1, palette },
    update: { palette },
  });

  return ok({ palette });
}
