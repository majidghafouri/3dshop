import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

const MAX_ATTEMPTS = 5;

type Field = "email" | "phone";

const PURPOSES: Record<Field, "EMAIL_VERIFY" | "MOBILE_VERIFY"> = {
  email: "EMAIL_VERIFY",
  phone: "MOBILE_VERIFY",
};

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{ field?: Field; code?: string }>(await req.text());
  const field = body?.field;
  if (field !== "email" && field !== "phone") return fail("invalid_field");

  const value = field === "email" ? user.email : user.phone;
  if (!value) return fail(field === "email" ? "no_email" : "no_phone");
  if (user[`${field}Verified`]) return fail("already_verified");

  const code = (body?.code ?? "").replace(/[^0-9]/g, "");
  if (!/^[0-9]{5}$/.test(code)) return fail("invalid_code");

  const purpose = PURPOSES[field];

  const otp = await prisma.otpCode.findFirst({
    where: { [field]: value, purpose, consumed: false },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return fail("invalid_code");
  if (otp.expiresAt.getTime() < Date.now()) return fail("expired_code", 400);

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

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { [`${field}Verified`]: true },
    select: { id: true, email: true, phone: true, emailVerified: true, phoneVerified: true },
  });

  return ok({
    field,
    user: {
      id: updated.id,
      email: updated.email,
      phone: updated.phone,
      emailVerified: updated.emailVerified,
      phoneVerified: updated.phoneVerified,
    },
  });
}
