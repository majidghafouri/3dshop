import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: "password_too_short" };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, error: "password_too_long" };
  }
  return { valid: true };
}
