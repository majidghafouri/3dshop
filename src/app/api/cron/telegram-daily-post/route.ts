import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { sendPhoto, sendMessage } from "@/lib/telegram";
import { generatePostBatch } from "@/lib/telegram-post-generator";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const posts = await generatePostBatch();
  const results: Array<{ type: string; success: boolean; error?: string }> = [];

  for (const post of posts) {
    try {
      if (post.image) {
        const res = await sendPhoto(post.image, post.text);
        results.push({ type: post.type, success: res.ok });
      } else {
        const res = await sendMessage(post.text);
        results.push({ type: post.type, success: res.ok });
      }
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      results.push({
        type: post.type,
        success: false,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return ok({ posted: results.length, results });
}
