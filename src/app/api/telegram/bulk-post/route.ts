import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { sendPhoto, sendMessage } from "@/lib/telegram";
import { generatePostBatch } from "@/lib/telegram-post-generator";

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const body = await req.json().catch(() => ({}));
  const count = Math.min(Math.max(Number(body.count) || 3, 1), 10);
  const totalPosts = count * 3;
  const results: Array<{ batch: number; type: string; success: boolean; error?: string }> = [];

  for (let batch = 0; batch < count; batch++) {
    const posts = await generatePostBatch();

    for (const post of posts) {
      try {
        if (post.image) {
          const res = await sendPhoto(post.image, post.text);
          results.push({ batch: batch + 1, type: post.type, success: res.ok });
        } else {
          const res = await sendMessage(post.text);
          results.push({ batch: batch + 1, type: post.type, success: res.ok });
        }
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        results.push({
          batch: batch + 1,
          type: post.type,
          success: false,
          error: err instanceof Error ? err.message : "unknown",
        });
      }
    }

    if (batch < count - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return ok({
    requested: count,
    totalPosts,
    posted: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}
