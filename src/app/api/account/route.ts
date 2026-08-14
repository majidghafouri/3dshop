import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { normalizeEmail, normalizePhone } from "@/lib/identifiers";

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{ name?: string; phone?: string; email?: string }>(await req.text());
  const name = (body?.name ?? "").trim().slice(0, 80);

  const emailRaw = (body?.email ?? "").trim();
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  if (emailRaw && !email) return fail("invalid_email");

  const phoneRaw = (body?.phone ?? "").trim();
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (phoneRaw && !phone) return fail("invalid_phone");

  if (email && email !== user.email && user.emailVerified) return fail("email_locked", 400);
  if (phone && phone !== (user.phone ?? null) && user.phoneVerified) return fail("phone_locked", 400);

  const data: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  } = {
    name: name.length ? name : null,
  };
  if (emailRaw) data.email = email;
  if (phoneRaw) data.phone = phone;

  if (email && email !== user.email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: user.id } },
      select: { id: true },
    });
    if (existing) return fail("email_taken", 409);
    data.emailVerified = false;
  }

  if (phone && phone !== (user.phone ?? null)) {
    const existing = await prisma.user.findFirst({
      where: { phone, NOT: { id: user.id } },
      select: { id: true },
    });
    if (existing) return fail("phone_taken", 409);
    data.phoneVerified = false;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, name: true, phone: true, email: true, emailVerified: true, phoneVerified: true },
  });

  return ok({
    user: {
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      emailVerified: updated.emailVerified,
      phoneVerified: updated.phoneVerified,
    },
  });
}
