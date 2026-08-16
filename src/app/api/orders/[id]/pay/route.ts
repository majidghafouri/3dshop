import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";
import { extendPaymentDeadline } from "@/lib/orders";
import { createVandarPayment, getVandarRedirectUrl, getVandarCallbackUrl } from "@/lib/vandar";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const result = await extendPaymentDeadline(user.id, params.id);
  if (!result.ok) {
    if (result.code === "not_found") return fail("not_found", 404);
    if (result.code === "already_paid") return fail("already_paid");
    return fail("not_pending");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id, userId: user.id },
  });
  if (!order) return fail("not_found", 404);

  if (order.paidAt) return fail("already_paid");

  const callbackUrl = getVandarCallbackUrl(order.id);

  const payment = await createVandarPayment({
    amount: order.total,
    callbackUrl,
    factorNumber: order.orderNumber.toString(),
    description: `Order #${order.orderNumber}`,
    mobileNumber: order.phone,
  });

  if (!payment.ok) {
    return fail("payment_init_failed", 502, { reason: payment.error });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentToken: payment.token },
  });

  const redirectUrl = getVandarRedirectUrl(payment.token);

  return ok({
    redirectUrl,
    deadline: result.deadline.toISOString(),
    extended: result.extended,
  });
}
