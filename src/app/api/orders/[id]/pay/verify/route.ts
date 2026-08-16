import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";
import { verifyVandarPayment } from "@/lib/vandar";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const token = body.token as string | undefined;

  if (!token) return fail("token_required");

  const order = await prisma.order.findUnique({
    where: { id: params.id, userId: user.id },
  });
  if (!order) return fail("not_found", 404);
  if (order.paidAt) return fail("already_paid");

  const result = await verifyVandarPayment(token);
  if (!result.ok) {
    return fail("payment_verify_failed", 502, { reason: result.error });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paymentToken: token,
    },
  });

  return ok({
    status: "PAID",
    amount: result.amount,
    transId: result.transId,
    cardNumber: result.cardNumber,
    paymentDate: result.paymentDate,
    trackingCode: result.transId.toString(),
    message: result.message,
  });
}
