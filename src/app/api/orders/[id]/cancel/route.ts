import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";
import { cancelExpiredOrders, cancelOrderForUser } from "@/lib/orders";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  // Clean up expired unpaid orders first, so the target order gets
  // auto-cancelled (and its stock returned) if it already passed the deadline.
  await cancelExpiredOrders();

  const result = await cancelOrderForUser(user.id, params.id);
  if (!result.ok) {
    if (result.code === "not_found") return fail("not_found", 404);
    if (result.code === "not_pending") return fail("not_cancellable");
    if (result.code === "cancel_limit") {
      return fail("cancel_limit", 429, {
        retryAfterMs: result.retryAfterMs,
        limit: result.limit,
        windowMinutes: result.windowMinutes,
      });
    }
  }

  return ok({ cancelled: true });
}
