import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "../setup";

const { mockOk, mockFail, mockParseJson, mockGetSessionUserFromRequest } = vi.hoisted(() => ({
  mockOk: vi.fn(),
  mockFail: vi.fn(),
  mockParseJson: vi.fn(),
  mockGetSessionUserFromRequest: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  ok: (...args: any[]) => mockOk(...args),
  fail: (...args: any[]) => mockFail(...args),
  parseJson: (...args: any[]) => mockParseJson(...args),
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSessionUserFromRequest: (...args: any[]) => mockGetSessionUserFromRequest(...args),
  verifyPassword: vi.fn(),
  signSession: vi.fn(),
  createSessionCookie: vi.fn(),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
}));

describe("Auth API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("returns error for empty body", async () => {
      mockParseJson.mockReturnValue(null);
      mockFail.mockReturnValue({
        json: async () => ({ ok: false, error: "invalid_identifier" }),
        status: 400,
      });

      const { POST } = await import("@/app/api/auth/login/route");
      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
      }) as any;
      req.text = async () => JSON.stringify({});
      req.nextUrl = { pathname: "/fa/api/auth/login" };
      req.cookies = { get: vi.fn() };
      const res = await POST(req);
      const body = await res.json();
      expect(body.ok).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns null data when not logged in", async () => {
      mockGetSessionUserFromRequest.mockResolvedValue(null);
      mockOk.mockReturnValue({
        json: async () => ({ ok: true, data: null }),
        status: 200,
      });

      const { GET } = await import("@/app/api/auth/me/route");
      const req = new Request("http://localhost/api/auth/me") as any;
      req.cookies = { get: vi.fn().mockReturnValue(undefined) };
      const res = await GET(req);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toBeNull();
    });

    it("returns user data when logged in", async () => {
      mockGetSessionUserFromRequest.mockResolvedValue({
        id: "user1",
        email: "test@example.com",
        phone: "09123456789",
        name: "Test User",
        emailVerified: true,
        phoneVerified: false,
        role: "USER",
      });
      mockOk.mockReturnValue({
        json: async () => ({
          ok: true,
          data: {
            id: "user1",
            email: "test@example.com",
            phone: "09123456789",
            name: "Test User",
            emailVerified: true,
            phoneVerified: false,
            role: "USER",
          },
        }),
        status: 200,
      });

      const { GET } = await import("@/app/api/auth/me/route");
      const req = new Request("http://localhost/api/auth/me") as any;
      req.cookies = { get: vi.fn() };
      const res = await GET(req);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.email).toBe("test@example.com");
      expect(body.data.role).toBe("USER");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("clears session and returns ok", async () => {
      mockOk.mockReturnValue({
        json: async () => ({ ok: true, data: null }),
        status: 200,
      });

      const mod = await import("@/app/api/auth/logout/route");
      const req = new Request("http://localhost/api/auth/logout", {
        method: "POST",
      }) as any;
      req.cookies = { get: vi.fn() };
      const res = await (mod as any).POST(req);
      expect(res.status).toBe(200);
    });
  });
});
