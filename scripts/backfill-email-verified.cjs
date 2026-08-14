/**
 * One-time backfill: mark existing users' email as verified.
 *
 * Before the email/phone verification feature shipped, every account was created
 * via an email-OTP registration, so all pre-existing emails were already proven.
 * This marks those rows `emailVerified = true` exactly once (guarded by a Setting
 * marker) right after `prisma db push` adds the column. Emails added later through
 * the profile are never auto-verified.
 */
const { PrismaClient } = require("@prisma/client");

const MARKER = "email_verified_backfilled";

async function main() {
  const prisma = new PrismaClient();
  try {
    const marker = await prisma.setting.findUnique({ where: { key: MARKER } });
    if (marker) {
      console.log("[backfill] email_verified_backfilled marker present, skipping");
      return;
    }
    const result = await prisma.$executeRawUnsafe(
      'UPDATE "User" SET "emailVerified" = true WHERE "email" IS NOT NULL;',
    );
    await prisma.setting.create({
      data: { key: MARKER, value: new Date().toISOString(), isSecret: false, group: "internal" },
    });
    console.log(`[backfill] marked ${result} existing user(s) as email-verified`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[backfill] failed:", err);
  process.exit(1);
});
