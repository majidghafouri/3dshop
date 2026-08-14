import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { sendOtpEmail, isEmailConfigured } from "@/lib/email";
import { sendOtpViaLookup, isSmsConfigured } from "@/lib/kavenegar";
import { normalizeEmail, normalizePhone, generateCode } from "@/lib/identifiers";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

type Field = "email" | "phone";

const PURPOSES: Record<Field, "EMAIL_VERIFY" | "MOBILE_VERIFY"> = {
  email: "EMAIL_VERIFY",
  phone: "MOBILE_VERIFY",
};

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{ field?: Field; value?: string }>(await req.text());
  const field = body?.field;
  if (field !== "email" && field !== "phone") return fail("invalid_field");

  const current = field === "email" ? user.email : user.phone;
  const rawValue = (body?.value ?? "").trim() || (current ?? "");
  const value = field === "email" ? normalizeEmail(rawValue) : normalizePhone(rawValue);
  if (!value) return fail(field === "email" ? "invalid_email" : "invalid_phone");
  if (value === current && user[`${field}Verified`]) return fail("already_verified");

  if (user[`${field}Verified`] && value !== current) {
    return fail(`${field}_locked`, 400);
  }

  const purpose = PURPOSES[field];

  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      [field]: value,
      purpose,
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

  if (value !== current) {
    const existing = await prisma.user.findFirst({
      where: { [field]: value, NOT: { id: user.id } },
      select: { id: true },
    });
    if (existing) return fail(`${field}_taken`, 409);

    await prisma.user.update({
      where: { id: user.id },
      data: { [field]: value, [`${field}Verified`]: false },
    });
  }

  await prisma.otpCode.updateMany({
    where: { [field]: value, purpose, consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      [field]: value,
      code,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const dev = process.env.NODE_ENV !== "production";
  const transportConfigured =
    field === "email" ? await isEmailConfigured() : await isSmsConfigured();

  try {
    if (dev || !transportConfigured) {
      console.log(`[account-verify] ${field}=${value} code=${code}${transportConfigured ? "" : ` (${field} transport not configured)`}`);
    } else if (field === "email") {
      await sendOtpEmail(value, code);
    } else {
      await sendOtpViaLookup(value, code);
    }
  } catch (err) {
    if (dev || !transportConfigured) {
      console.warn("[account-verify] send skipped:", err);
    } else {
      await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
      const detail = err instanceof Error ? err.message : "unknown error";
      return fail(field === "email" ? "email_failed" : "sms_failed", 400, { detail });
    }
  }

  return ok({
    field,
    [field]: value,
    expiresIn: OTP_TTL_MS / 1000,
    cooldown: OTP_RESEND_COOLDOWN_MS / 1000,
    ...(dev || !transportConfigured ? { devCode: code } : {}),
  });
}
