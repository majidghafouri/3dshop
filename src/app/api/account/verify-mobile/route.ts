import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { normalizePhone } from "@/lib/kavenegar";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);
  if (user.phoneVerified) return fail("already_verified");
  if (!user.phone) return fail("no_phone");

  const phone = normalizePhone(user.phone);
  if (!phone) return fail("invalid_phone");

  const body = parseJson<{ code?: string }>(await req.text());
  const code = (body?.code ?? "").replace(/[^0-9]/g, "");
  if (!/^[0-9]{5}$/.test(code)) return fail("invalid_code");

  const otp = await prisma.otpCode.findFirst({
    where: { phone, purpose: "MOBILE_VERIFY", consumed: false },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return fail("invalid_code");
  if (otp.expiresAt.getTime() < Date.now()) return fail("expired_code", 400);

  if (otp.code !== code) {
    const attempts = otp.attempts + 1;
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { attempts, ...(attempts >= MAX_ATTEMPTS ? { consumed: true } : {}) },
    });
    return fail("invalid_code");
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumed: true, attempts: otp.attempts + 1 },
  });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerified: true },
    select: { id: true, phone: true, phoneVerified: true },
  });

  return ok({
    user: { id: updated.id, phone: updated.phone, phoneVerified: updated.phoneVerified },
  });
}
