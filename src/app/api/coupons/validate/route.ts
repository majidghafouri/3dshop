import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{ code?: string; subtotal?: number }>(await req.text());
  if (!body?.code) return fail("fill_required");

  const code = body.code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon) return fail("coupon_not_found");
  if (!coupon.isActive) return fail("coupon_inactive");

  const now = new Date();
  if (now < coupon.validFrom) return fail("coupon_not_started");
  if (now > coupon.validUntil) return fail("coupon_expired");

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return fail("coupon_limit_reached");
  }

  if (body.subtotal != null && coupon.minOrderAmount != null && body.subtotal < coupon.minOrderAmount) {
    return fail("coupon_min_order_not_met", 400, { minOrderAmount: coupon.minOrderAmount });
  }

  let discountAmount = 0;
  if (coupon.type === "PERCENTAGE") {
    discountAmount = Math.round(((body.subtotal ?? 0) * coupon.value) / 100);
    if (coupon.maxDiscountAmount != null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = Math.min(coupon.value, body.subtotal ?? coupon.value);
  }

  return ok({
    couponId: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
    minOrderAmount: coupon.minOrderAmount,
    maxDiscountAmount: coupon.maxDiscountAmount,
  });
}
