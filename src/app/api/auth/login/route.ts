import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { createSessionCookie, setSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { mergeGuestCart } from "@/lib/cart";
import { resolveIdentifierFromBody } from "@/lib/identifiers";

export async function POST(req: NextRequest) {
  const body = parseJson<{ email?: string; phone?: string; password?: string }>(await req.text());
  const identifier = resolveIdentifierFromBody(body ?? {});
  const password = body?.password ?? "";

  if (!identifier) return fail("invalid_identifier");
  if (!password) return fail("invalid_password");

  const { field, value } = identifier;

  const user = await prisma.user.findUnique({
    where: field === "email" ? { email: value } : { phone: value },
  });

  if (!user || !user.password) return fail("invalid_credentials", 401);

  const valid = await verifyPassword(password, user.password);
  if (!valid) return fail("invalid_credentials", 401);

  const token = await createSessionCookie({
    id: user.id,
    email: user.email ?? value,
    role: user.role as "USER" | "ADMIN",
  });
  setSessionCookie(token);

  const guestToken = req.cookies.get("cart_token")?.value ?? null;
  if (guestToken) {
    await mergeGuestCart(user.id, guestToken);
  }

  return ok({
    user: {
      id: user.id,
      email: user.email ?? null,
      phone: user.phone ?? null,
      role: user.role,
    },
  });
}
