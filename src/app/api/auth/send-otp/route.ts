import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 3 * 60 * 1000;
const KAVENEGAR_TEMPLATE = "mobileverify";
// Lookup delivers the template via SMS by default; set explicitly per Kavenegar docs.
const KAVENEGAR_LOOKUP_TYPE = "sms";
// %token2 in the template (e.g. a fixed brand signature/link). Safe to pass even if the
// template only uses %token — Kavenegar ignores unused tokens.
const KAVENEGAR_TOKEN2 = process.env.KAVENEGAR_TOKEN2 ?? "@figureforge.ir";

type OtpPurpose = "REGISTER" | "PASSWORD_RESET";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const match = digits.match(/^(?:98|0)?(9\d{9})$/);
  if (!match) return null;
  return `0${match[1]}`;
}

function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const n = buf[0] % 90000;
  return String(10000 + n);
}

type KavenegarEntry = {
  messageid?: number;
  cost?: number;
  receptor?: string;
};

type KavenegarEnvelope = {
  return?: { status: number; message: string };
  entries?: KavenegarEntry[];
};

async function sendOtpViaKavenegar(phone: string, code: string): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) throw new Error("KAVENEGAR_API_KEY is not configured");
  const res = await fetch(
    `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        receptor: phone,
        token: code,
        token2: KAVENEGAR_TOKEN2,
        template: KAVENEGAR_TEMPLATE,
        type: KAVENEGAR_LOOKUP_TYPE,
      }),
      cache: "no-store",
    },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`kavenegar http ${res.status}: ${text}`);
  let data: KavenegarEnvelope;
  try {
    data = JSON.parse(text) as KavenegarEnvelope;
  } catch {
    throw new Error(`kavenegar invalid response: ${text}`);
  }
  const status = data.return?.status;
  if (status !== 200) {
    throw new Error(
      `kavenegar lookup failed (${status ?? "?"}): ${data.return?.message ?? "unknown error"}`,
    );
  }
  const entry = data.entries?.[0];
  if (entry?.messageid) {
    console.log(
      `[OTP] kavenegar delivered messageid=${entry.messageid} cost=${entry.cost ?? "?"} receptor=${entry.receptor ?? phone}`,
    );
  }
}

export async function POST(req: NextRequest) {
  const body = parseJson<{ phone?: string; purpose?: OtpPurpose }>(await req.text());
  const phone = normalizePhone(body?.phone ?? "");
  if (!phone) return fail("invalid_phone");

  const purpose = body?.purpose ?? "REGISTER";

  if (purpose === "PASSWORD_RESET") {
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { password: true },
    });
    if (!user || !user.password) return fail("no_password_set", 404);
  }

  if (purpose === "REGISTER") {
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { password: true },
    });
    if (user && user.password) return fail("user_exists_use_login", 409);
  }

  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      phone,
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
    where: { phone, purpose, consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      phone,
      code,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const dev = process.env.NODE_ENV !== "production";

  try {
    await sendOtpViaKavenegar(phone, code);
  } catch (err) {
    if (dev) {
      console.warn("[OTP] kavenegar skipped:", err);
    } else {
      await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
      return fail("sms_failed");
    }
  }

  if (dev) console.log(`[OTP] phone=${phone} code=${code} purpose=${purpose}`);

  return ok({
    phone,
    expiresIn: OTP_TTL_MS / 1000,
    ...(dev ? { devCode: code } : {}),
  });
}
