import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { mergeGuestCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  const body = parseJson<{ phone?: string; password?: string }>(await req.text());
  const phone = (body?.phone ?? "").replace(/[^\d]/g, "");
  const password = body?.password ?? "";

  if (!/^09\d{9}$/.test(phone)) return fail("invalid_phone");
  if (!password) return fail("invalid_password");

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user || !user.password) return fail("invalid_credentials", 401);

  const valid = await verifyPassword(password, user.password);
  if (!valid) return fail("invalid_credentials", 401);

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
