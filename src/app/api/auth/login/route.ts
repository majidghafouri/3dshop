import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { createSessionCookie, setSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { mergeGuestCart } from "@/lib/cart";

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const body = parseJson<{ email?: string; password?: string }>(await req.text());
  const email = normalizeEmail(body?.email ?? "");
  const password = body?.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("invalid_email");
  if (!password) return fail("invalid_password");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) return fail("invalid_credentials", 401);

  const valid = await verifyPassword(password, user.password);
  if (!valid) return fail("invalid_credentials", 401);

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
