import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { sendOtpEmail } from "@/lib/email";
import { isSmtpConfigured } from "@/lib/email";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 3 * 60 * 1000;

type OtpPurpose = "REGISTER" | "PASSWORD_RESET";

function normalizeEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = buf[0] % 90000;
  return String(10000 + n);
}

export async function POST(req: NextRequest) {
  const body = parseJson<{ email?: string; purpose?: OtpPurpose }>(await req.text());
  const email = normalizeEmail(body?.email ?? "");
  if (!email) return fail("invalid_email");

  const purpose = body?.purpose ?? "REGISTER";

  if (purpose === "PASSWORD_RESET") {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
    if (!user || !user.password) return fail("no_password_set", 404);
  }

  if (purpose === "REGISTER") {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
    if (user && user.password) return fail("user_exists_use_login", 409);
  }

  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      email,
      purpose,
      createdAt: { gte: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recentOtp) {
    return fail("otp_cooldown", 429, {
      retryAfter: Math.ceil((OTP_RESEND_COOLDOWN_MS - (Date.now() - recentOtp.createdAt.getTime())) / 1000),
    });
  }

  await prisma.otpCode.updateMany({
    where: { email, purpose, consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      email,
      code,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const dev = process.env.NODE_ENV !== "production";
  const smtpConfigured = await isSmtpConfigured();

  try {
    if (dev || !smtpConfigured) {
      console.log(`[OTP] email=${email} code=${code} purpose=${purpose}${smtpConfigured ? "" : " (SMTP not configured)"}`);
    } else {
      await sendOtpEmail(email, code);
    }
  } catch (err) {
    if (dev || !smtpConfigured) {
      console.warn("[OTP] email send skipped:", err);
    } else {
      await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
      const detail = err instanceof Error ? err.message : "unknown error";
      return fail("email_failed", 400, { detail });
    }
  }

  return ok({
    email,
    expiresIn: OTP_TTL_MS / 1000,
    ...(dev || !smtpConfigured ? { devCode: code } : {}),
  });
}
