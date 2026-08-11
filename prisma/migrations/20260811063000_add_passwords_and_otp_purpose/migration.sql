-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('REGISTER', 'PASSWORD_RESET');

-- Add password column to User
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Add purpose column to OtpCode (default to REGISTER for existing rows)
ALTER TABLE "OtpCode" ADD COLUMN "purpose" "OtpPurpose" NOT NULL DEFAULT 'REGISTER';

-- Create index for efficient lookups by phone + purpose
CREATE INDEX "OtpCode_phone_purpose_createdAt_idx" ON "OtpCode"("phone", "purpose", "createdAt");
