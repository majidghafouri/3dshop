import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";
import { extendPaymentDeadline } from "@/lib/orders";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const result = await extendPaymentDeadline(user.id, params.id);
  if (!result.ok) {
    if (result.code === "not_found") return fail("not_found", 404);
    if (result.code === "already_paid") return fail("already_paid");
    return fail("not_pending");
  }

  return ok({ deadline: result.deadline.toISOString(), extended: result.extended });
}
