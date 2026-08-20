import { describe, it, expect } from "vitest";
import { signSession, verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

describe("signSession", () => {
  it("returns a JWT string", async () => {
    const token = await signSession({
      sub: "user123",
      email: "test@example.com",
      role: "USER",
    });
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });
});

describe("verifySessionToken", () => {
  it("verifies a valid token", async () => {
    const payload = { sub: "user123", email: "test@example.com", role: "USER" as const };
    const token = await signSession(payload);
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.sub).toBe("user123");
    expect(verified?.email).toBe("test@example.com");
    expect(verified?.role).toBe("USER");
  });

  it("returns null for invalid token", async () => {
    const result = await verifySessionToken("invalid.token.here");
    expect(result).toBeNull();
  });

  it("returns null for empty string", async () => {
    const result = await verifySessionToken("");
    expect(result).toBeNull();
  });

  it("returns null for tampered token", async () => {
    const token = await signSession({
      sub: "user123",
      email: "test@example.com",
      role: "USER",
    });
    const parts = token.split(".");
    parts[1] = "tampered";
    const result = await verifySessionToken(parts.join("."));
    expect(result).toBeNull();
  });

  it("returns null for token signed with different secret", async () => {
    const { SignJWT } = await import("jose");
    const wrongSecret = new TextEncoder().encode("wrong-secret-key");
    const token = await new SignJWT({
      sub: "user123",
      email: "test@example.com",
      role: "USER",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(wrongSecret);

    const result = await verifySessionToken(token);
    expect(result).toBeNull();
  });

  it("preserves admin role", async () => {
    const token = await signSession({
      sub: "admin1",
      email: "admin@example.com",
      role: "ADMIN",
    });
    const verified = await verifySessionToken(token);
    expect(verified?.role).toBe("ADMIN");
  });
});

describe("SESSION_COOKIE", () => {
  it("has correct cookie name", () => {
    expect(SESSION_COOKIE).toBe("figureforge_session");
  });
});
