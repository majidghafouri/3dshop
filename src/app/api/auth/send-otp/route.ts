import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";

const OTP_TTL_MS = 5 * 60 * 1000;

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const match = digits.match(/^(?:98|0)?(9\d{9})$/);
  if (!match) return null;
  return `0${match[1]}`;
}

function generateCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

type KavenegarEnvelope = {
  return?: { status: number; message: string };
};

function buildOtpMessage(code: string): string {
  return `کاربر گرامی فیگرفورج،

کد احراز هویت شما:

${code}

@figureforge.ir ${code}`;
}

async function sendOtpViaKavenegar(phone: string, code: string): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) throw new Error("KAVENEGAR_API_KEY is not configured");
  const sender = process.env.KAVENEGAR_SENDER;
  if (!sender) throw new Error("KAVENEGAR_SENDER is not configured");
  const res = await fetch(
    `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        receptor: phone,
        sender,
        message: buildOtpMessage(code),
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
  if (data.return?.status !== 200) {
    throw new Error(`kavenegar ${data.return?.status}: ${data.return?.message}`);
  }
}

export async function POST(req: NextRequest) {
  const body = parseJson<{ phone?: string }>(await req.text());
  const phone = normalizePhone(body?.phone ?? "");
  if (!phone) return fail("invalid_phone");

  await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      phone,
      code,
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

  if (dev) console.log(`[OTP] phone=${phone} code=${code}`);

  return ok({
    phone,
    expiresIn: OTP_TTL_MS / 1000,
    ...(dev ? { devCode: code } : {}),
  });
}
