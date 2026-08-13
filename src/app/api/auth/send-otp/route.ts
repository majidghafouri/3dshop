import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSetting } from "@/lib/settings";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 3 * 60 * 1000;

// OTP delivery channel, controlled from the admin panel (Setting "otp_method").
//  - ADVERTISE -> خط تبلیغاتی: Kavenegar sms/send.json (default)
//  - SERVICE   -> خط خدماتی:   Kavenegar verify/lookup.json (template-based)
type OtpChannel = "SERVICE" | "ADVERTISE";
const OTP_METHOD_KEY = "otp_method";
const KAVENEGAR_SENDER_KEY = "kavenegar_sender";
const DEFAULT_OTP_CHANNEL: OtpChannel = "ADVERTISE";

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

async function postKavenegar(
  path: string,
  params: Record<string, string>,
): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) throw new Error("KAVENEGAR_API_KEY is not configured");
  const res = await fetch(`https://api.kavenegar.com/v1/${apiKey}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    cache: "no-store",
  });
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
      `kavenegar ${path} failed (${status ?? "?"}): ${data.return?.message ?? "unknown error"}`,
    );
  }
  const entry = data.entries?.[0];
  if (entry?.messageid) {
    console.log(
      `[OTP] kavenegar delivered (${path}) messageid=${entry.messageid} cost=${entry.cost ?? "?"} receptor=${entry.receptor ?? params.receptor}`,
    );
  }
}

// SERVICE channel: خط خدماتی — template-based verify/lookup.json
async function sendOtpViaLookup(phone: string, code: string): Promise<void> {
  await postKavenegar("verify/lookup.json", {
    receptor: phone,
    token: code,
    token2: KAVENEGAR_TOKEN2,
    template: KAVENEGAR_TEMPLATE,
    type: KAVENEGAR_LOOKUP_TYPE,
  });
}

// ADVERTISE channel: خط تبلیغاتی — free-form sms/send.json
async function sendOtpViaSend(phone: string, code: string): Promise<void> {
  const message = `کاربر گرامی فیگرفورج\nکد احراز هویت شما:\n${code}\n@figureforge.ir`;
  const params: Record<string, string> = { receptor: phone, message };
  const sender = await getSetting(KAVENEGAR_SENDER_KEY);
  if (sender) params.sender = sender;
  await postKavenegar("sms/send.json", params);
}

async function sendOtp(phone: string, code: string, channel: OtpChannel): Promise<void> {
  if (channel === "SERVICE") return sendOtpViaLookup(phone, code);
  return sendOtpViaSend(phone, code);
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

  const channel: OtpChannel =
    (await getSetting(OTP_METHOD_KEY)) === "SERVICE" ? "SERVICE" : DEFAULT_OTP_CHANNEL;

  const dev = process.env.NODE_ENV !== "production";

  try {
    await sendOtp(phone, code, channel);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    if (dev) {
      console.warn(`[OTP] kavenegar skipped (channel=${channel}):`, err);
    } else {
      await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
      return fail("sms_failed", 400, { detail });
    }
  }

  if (dev) console.log(`[OTP] phone=${phone} code=${code} purpose=${purpose} channel=${channel}`);

  return ok({
    phone,
    expiresIn: OTP_TTL_MS / 1000,
    ...(dev ? { devCode: code } : {}),
  });
}
