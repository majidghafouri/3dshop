import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";
import { mergeGuestCart } from "@/lib/cart";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const body = parseJson<{ phone?: string; code?: string }>(await req.text());
  const phone = (body?.phone ?? "").replace(/[^\d]/g, "");
  const code = (body?.code ?? "").replace(/[^\d]/g, "");

  if (!/^09\d{9}$/.test(phone)) return fail("invalid_phone");
  if (!/^\d{5}$/.test(code)) return fail("invalid_code");

  const otp = await prisma.otpCode.findFirst({
    where: { phone, consumed: false },
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

  const isAdminPhone = !!process.env.ADMIN_PHONE && phone === process.env.ADMIN_PHONE.replace(/[^\d]/g, "");

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
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
