import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { publishNextBankPost } from "@/lib/blog";
import { generateDailyPost } from "@/lib/blog-generator";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const bankPost = await publishNextBankPost();
  if (bankPost) return ok({ published: true, slug: bankPost.slug, source: "bank" });

  const generated = await generateDailyPost();
  if (generated) return ok({ published: true, slug: generated.slug, source: "generated" });

  return ok({ published: false });
}
