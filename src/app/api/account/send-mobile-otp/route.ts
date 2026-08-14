import prisma from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { normalizePhone, generateCode, sendOtpViaLookup } from "@/lib/kavenegar";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export async function POST() {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);
  if (user.phoneVerified) return fail("already_verified");
  if (!user.phone) return fail("no_phone");

  const phone = normalizePhone(user.phone);
  if (!phone) return fail("invalid_phone");

  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      phone,
      purpose: "MOBILE_VERIFY",
      createdAt: { gte: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recentOtp) {
    return fail("otp_cooldown", 429, {
      retryAfter: Math.ceil(
        (OTP_RESEND_COOLDOWN_MS - (Date.now() - recentOtp.createdAt.getTime())) / 1000,
      ),
    });
  }

  await prisma.otpCode.updateMany({
    where: { phone, purpose: "MOBILE_VERIFY", consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      phone,
      code,
      purpose: "MOBILE_VERIFY",
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const dev = process.env.NODE_ENV !== "production";

  try {
    await sendOtpViaLookup(phone, code);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    if (dev) {
      console.warn("[mobile-verify] kavenegar skipped:", err);
    } else {
      await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
      return fail("sms_failed", 400, { detail });
    }
  }

  if (dev) console.log(`[mobile-verify] phone=${phone} code=${code}`);

  return ok({
    phone,
    expiresIn: OTP_TTL_MS / 1000,
    cooldown: OTP_RESEND_COOLDOWN_MS / 1000,
    ...(dev ? { devCode: code } : {}),
  });
}
