import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{ name?: string; phone?: string }>(await req.text());
  const name = (body?.name ?? "").trim().slice(0, 80);
  const phoneRaw = (body?.phone ?? "").trim();
  const phone = phoneRaw ? phoneRaw.replace(/[^\d]/g, "") : null;

  if (phone && !/^09\d{9}$/.test(phone)) return fail("invalid_phone");

  if (phone) {
    const existing = await prisma.user.findFirst({
      where: { phone, NOT: { id: user.id } },
      select: { id: true },
    });
    if (existing) return fail("phone_taken", 409);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name.length ? name : null,
      phone,
    },
    select: { id: true, name: true, phone: true, email: true },
  });

  return ok({
    user: { id: updated.id, name: updated.name, phone: updated.phone, email: updated.email },
  });
}
