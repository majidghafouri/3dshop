import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  validatePassword,
} from "@/lib/password";

describe("hashPassword", () => {
  it("returns a bcrypt hash string", async () => {
    const hash = await hashPassword("testpassword123");
    expect(hash).toMatch(/^\$2[aby]?\$/);
    expect(hash.length).toBeGreaterThan(50);
  });

  it("generates different hashes for same password", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("mypassword", hash)).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("returns false for empty password against hash", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("", hash)).toBe(false);
  });
});

describe("validatePassword", () => {
  it("returns valid for password >= 8 chars", () => {
    expect(validatePassword("12345678")).toEqual({ valid: true });
  });

  it("returns invalid for password < 8 chars", () => {
    expect(validatePassword("1234567")).toEqual({
      valid: false,
      error: "password_too_short",
    });
  });

  it("returns invalid for empty password", () => {
    expect(validatePassword("")).toEqual({
      valid: false,
      error: "password_too_short",
    });
  });

  it("returns invalid for password > 128 chars", () => {
    expect(validatePassword("a".repeat(129))).toEqual({
      valid: false,
      error: "password_too_long",
    });
  });

  it("returns valid for exactly 128 chars", () => {
    expect(validatePassword("a".repeat(128))).toEqual({ valid: true });
  });
});
