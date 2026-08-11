import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { publishNextBankPost } from "@/lib/blog";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const post = await publishNextBankPost();
  if (!post) return ok({ published: false });

  return ok({ published: true, slug: post.slug });
}
