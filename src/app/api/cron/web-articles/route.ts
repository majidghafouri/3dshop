import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { importWebArticles } from "@/lib/web-articles";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const results = await importWebArticles(2);

  const imported = results.filter((r) => r.status === "imported");
  const skipped = results.filter((r) => r.status === "skipped");
  const errors = results.filter((r) => r.status === "failed");

  return ok({
    imported: imported.length,
    skipped: skipped.length,
    errors: errors.length > 0 ? errors : undefined,
    results,
  });
}
