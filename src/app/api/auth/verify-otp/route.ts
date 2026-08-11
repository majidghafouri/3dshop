import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";
import { hashPassword, validatePassword } from "@/lib/password";
import { mergeGuestCart } from "@/lib/cart";

const MAX_ATTEMPTS = 5;

type OtpPurpose = "REGISTER" | "PASSWORD_RESET";

export async function POST(req: NextRequest) {
  const body = parseJson<{ phone?: string; code?: string; purpose?: OtpPurpose; password?: string }>(
    await req.text(),
  );
  const phone = (body?.phone ?? "").replace(/[^\d]/g, "");
  const code = (body?.code ?? "").replace(/[^\d]/g, "");
  const purpose = body?.purpose ?? "REGISTER";
  const password = body?.password ?? "";

  if (!/^09\d{9}$/.test(phone)) return fail("invalid_phone");
  if (!/^\d{5}$/.test(code)) return fail("invalid_code");

  if (purpose === "REGISTER") {
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return fail(pwCheck.error ?? "invalid_password");
  }

  if (purpose === "PASSWORD_RESET") {
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { password: true },
    });
    if (!user || !user.password) return fail("no_password_set", 404);
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return fail(pwCheck.error ?? "invalid_password");
  }

  const otp = await prisma.otpCode.findFirst({
    where: { phone, purpose, consumed: false },
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
      data: { attempts },
    });
    if (attempts >= MAX_ATTEMPTS) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
    }
    return fail("invalid_code");
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumed: true },
  });

  const isAdminPhone =
    !!process.env.ADMIN_PHONE &&
    phone === process.env.ADMIN_PHONE.replace(/[^\d]/g, "");

  const data: { password?: string | null } = {};
  if (purpose === "REGISTER" || purpose === "PASSWORD_RESET") {
    data.password = await hashPassword(password);
  }

  const user = await prisma.user.upsert({
    where: { phone },
    update: data,
    create: { phone, password: data.password ?? null },
  });

  if (isAdminPhone && user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
    user.role = "ADMIN";
  }

  const token = await (
    await import("@/lib/auth")
  ).createSessionCookie({
    id: user.id,
    phone: user.phone,
    role: user.role as "USER" | "ADMIN",
  });
  setSessionCookie(token);

  const guestToken = req.cookies.get("cart_token")?.value ?? null;
  if (guestToken) {
    await mergeGuestCart(user.id, guestToken);
  }

  return ok({
    user: { id: user.id, phone: user.phone, role: user.role },
  });
}
