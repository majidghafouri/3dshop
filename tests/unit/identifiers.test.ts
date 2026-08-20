import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  normalizePhone,
  resolveIdentifier,
  resolveIdentifierFromBody,
  generateCode,
} from "@/lib/identifiers";

describe("normalizeEmail", () => {
  it("returns lowercase trimmed email for valid input", () => {
    expect(normalizeEmail("  Test@Example.COM  ")).toBe("test@example.com");
  });

  it("returns null for invalid email without @", () => {
    expect(normalizeEmail("notanemail")).toBeNull();
  });

  it("returns null for email without domain", () => {
    expect(normalizeEmail("user@")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(normalizeEmail("")).toBeNull();
  });

  it("returns null for email with spaces", () => {
    expect(normalizeEmail("user @example.com")).toBeNull();
  });

  it("handles international domains", () => {
    expect(normalizeEmail("user@domain.co.uk")).toBe("user@domain.co.uk");
  });
});

describe("normalizePhone", () => {
  it("normalizes Iranian phone with 0 prefix", () => {
    expect(normalizePhone("09123456789")).toBe("09123456789");
  });

  it("normalizes Iranian phone with 98 prefix", () => {
    expect(normalizePhone("989123456789")).toBe("09123456789");
  });

  it("strips non-digit characters", () => {
    expect(normalizePhone("+98-912-345-6789")).toBe("09123456789");
  });

  it("returns null for too short number", () => {
    expect(normalizePhone("912345")).toBeNull();
  });

  it("returns null for non-Iranian prefix", () => {
    expect(normalizePhone("1234567890")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(normalizePhone("")).toBeNull();
  });

  it("returns null for alphabetic input", () => {
    expect(normalizePhone("abc")).toBeNull();
  });
});

describe("resolveIdentifier", () => {
  it("resolves email identifier", () => {
    const result = resolveIdentifier("test@example.com");
    expect(result).toEqual({ field: "email", value: "test@example.com" });
  });

  it("resolves phone identifier", () => {
    const result = resolveIdentifier("09123456789");
    expect(result).toEqual({ field: "phone", value: "09123456789" });
  });

  it("returns null for invalid input", () => {
    expect(resolveIdentifier("not valid")).toBeNull();
  });

  it("prefers email over phone when both match", () => {
    const result = resolveIdentifier("test@9123456789.com");
    expect(result?.field).toBe("email");
  });
});

describe("resolveIdentifierFromBody", () => {
  it("resolves from email field", () => {
    const result = resolveIdentifierFromBody({ email: "test@example.com" });
    expect(result).toEqual({ field: "email", value: "test@example.com" });
  });

  it("resolves from phone field", () => {
    const result = resolveIdentifierFromBody({ phone: "09123456789" });
    expect(result).toEqual({ field: "phone", value: "09123456789" });
  });

  it("prefers email over phone", () => {
    const result = resolveIdentifierFromBody({
      email: "test@example.com",
      phone: "09123456789",
    });
    expect(result?.field).toBe("email");
  });

  it("returns null when both empty", () => {
    expect(resolveIdentifierFromBody({})).toBeNull();
  });

  it("returns null for invalid values", () => {
    expect(resolveIdentifierFromBody({ email: "invalid" })).toBeNull();
  });
});

describe("generateCode", () => {
  it("generates a 5-digit code", () => {
    const code = generateCode();
    expect(code).toHaveLength(5);
    expect(/^\d{5}$/.test(code)).toBe(true);
  });

  it("generates codes in range 10000-99999", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode();
      const num = parseInt(code, 10);
      expect(num).toBeGreaterThanOrEqual(10000);
      expect(num).toBeLessThanOrEqual(99999);
    }
  });

  it("generates different codes on successive calls", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});
