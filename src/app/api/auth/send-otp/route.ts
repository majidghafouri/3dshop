import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const match = digits.match(/^(?:98|0)?(9\d{9})$/);
  if (!match) return null;
  return `0${match[1]}`;
}

function generateCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
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
  await prisma.otpCode.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[OTP] phone=${phone} code=${code}`);
  }

  return ok({
    phone,
    expiresIn: 300,
    ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
  });
}
