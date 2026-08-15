import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { cancelExpiredOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return fail("Unauthorized", 401);
  }

  const cancelled = await cancelExpiredOrders();
  return ok({ cancelled });
}
