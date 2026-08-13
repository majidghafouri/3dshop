import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { createSessionCookie, setSessionCookie } from "@/lib/auth";
import { hashPassword, validatePassword } from "@/lib/password";
import { mergeGuestCart } from "@/lib/cart";

const MAX_ATTEMPTS = 5;

type OtpPurpose = "REGISTER" | "PASSWORD_RESET";

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const body = parseJson<{ email?: string; code?: string; purpose?: OtpPurpose; password?: string }>(
    await req.text(),
  );
  const email = normalizeEmail(body?.email ?? "");
  const code = (body?.code ?? "").replace(/[^0-9]/g, "");
  const purpose = body?.purpose ?? "REGISTER";
  const password = body?.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("invalid_email");
  if (!/^[0-9]{5}$/.test(code)) return fail("invalid_code");

  if (purpose === "REGISTER" || purpose === "PASSWORD_RESET") {
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return fail(pwCheck.error ?? "invalid_password");
  }

  const otp = await prisma.otpCode.findFirst({
    where: { email, purpose, consumed: false },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return fail("invalid_code");

  if (otp.expiresAt.getTime() < Date.now()) {
    return fail("expired_code", 400);
  }

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

  const isAdminEmail = !!process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.trim().toLowerCase();

  const data: { password?: string | null } = {};
  if (purpose === "REGISTER" || purpose === "PASSWORD_RESET") {
    data.password = await hashPassword(password);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: data,
    create: { email, password: data.password ?? null },
  });

  if (isAdminEmail && user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  }

  const token = await createSessionCookie({
    id: user.id,
    email: user.email ?? email,
    role: user.role as "USER" | "ADMIN",
  });
  setSessionCookie(token);

  const guestToken = req.cookies.get("cart_token")?.value ?? null;
  if (guestToken) {
    await mergeGuestCart(user.id, guestToken);
  }

  return ok({
    user: { id: user.id, email: user.email ?? email, role: user.role },
  });
}
