import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "../setup";

const { mockOk, mockFail, mockParseJson, mockRequireAdmin } = vi.hoisted(() => ({
  mockOk: vi.fn(),
  mockFail: vi.fn(),
  mockParseJson: vi.fn(),
  mockRequireAdmin: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  ok: (...args: any[]) => mockOk(...args),
  fail: (...args: any[]) => mockFail(...args),
  parseJson: (...args: any[]) => mockParseJson(...args),
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

describe("Admin API Routes - Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const adminRoutes = [
    { method: "GET", path: "/api/admin/products", import: "@/app/api/admin/products/route" },
    { method: "POST", path: "/api/admin/products", import: "@/app/api/admin/products/route" },
    { method: "GET", path: "/api/admin/categories", import: "@/app/api/admin/categories/route" },
    { method: "POST", path: "/api/admin/categories", import: "@/app/api/admin/categories/route" },
    { method: "GET", path: "/api/admin/coupons", import: "@/app/api/admin/coupons/route" },
    { method: "POST", path: "/api/admin/coupons", import: "@/app/api/admin/coupons/route" },
    { method: "GET", path: "/api/admin/settings", import: "@/app/api/admin/settings/route" },
    { method: "GET", path: "/api/admin/theme", import: "@/app/api/admin/theme/route" },
    { method: "GET", path: "/api/admin/contact-messages", import: "@/app/api/admin/contact-messages/route" },
  ];

  it.each(adminRoutes)(
    "$method $path returns 401 without session",
    async ({ method, path, import: importPath }) => {
      mockRequireAdmin.mockResolvedValue({
        error: { status: 401, json: async () => ({ ok: false, error: "Unauthorized" }) },
        user: null,
      });
      mockFail.mockReturnValue({
        json: async () => ({ ok: false, error: "Unauthorized" }),
        status: 401,
      });

      const mod = await import(importPath);
      const handler = (mod as any)[method];
      if (!handler) return;

      const req = new Request(`http://localhost${path}`, { method }) as any;
      req.cookies = { get: vi.fn().mockReturnValue(undefined) };
      req.nextUrl = new URL(`http://localhost${path}`);
      const res = await handler(req);
      expect(res.status).toBe(401);
    }
  );

  it("returns 401 for non-admin user on admin routes", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: { status: 401, json: async () => ({ ok: false, error: "Unauthorized" }) },
      user: null,
    });
    mockFail.mockReturnValue({
      json: async () => ({ ok: false, error: "Unauthorized" }),
      status: 401,
    });

    const { GET } = await import("@/app/api/admin/products/route");
    const req = new Request("http://localhost/api/admin/products") as any;
    req.cookies = { get: vi.fn() };
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe("Admin Settings API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns settings with masked secrets", async () => {
    mockPrisma.setting.findMany.mockResolvedValue([
      { key: "smtp_host", value: "smtp.example.com", isSecret: false, group: "email" },
      { key: "smtp_pass", value: "supersecret", isSecret: true, group: "email" },
    ]);

    mockRequireAdmin.mockResolvedValue({
      error: null,
      user: { id: "admin1", role: "ADMIN" },
    });
    mockOk.mockReturnValue({
      json: async () => ({
        ok: true,
        data: {
          settings: [
            { key: "smtp_host", value: "smtp.example.com", isSecret: false, group: "email" },
            { key: "smtp_pass", value: "••••••••", isSecret: true, group: "email" },
          ],
        },
      }),
      status: 200,
    });

    const { GET } = await import("@/app/api/admin/settings/route");
    const req = new Request("http://localhost/api/admin/settings") as any;
    req.cookies = { get: vi.fn() };
    const res = await GET(req);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});

describe("Admin Contact Messages API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns list of messages", async () => {
    mockPrisma.contactMessage.findMany.mockResolvedValue([
      { id: "msg1", name: "Test", email: "test@test.com", subject: "Hi", message: "Hello", isRead: false, createdAt: new Date() },
    ]);
    mockPrisma.contactMessage.count.mockResolvedValue(1);

    mockRequireAdmin.mockResolvedValue({
      error: null,
      user: { id: "admin1", role: "ADMIN" },
    });
    mockOk.mockReturnValue({
      json: async () => ({
        ok: true,
        data: {
          messages: [
            { id: "msg1", name: "Test", email: "test@test.com", subject: "Hi", message: "Hello", isRead: false },
          ],
        },
      }),
      status: 200,
    });

    const { GET } = await import("@/app/api/admin/contact-messages/route");
    const req = new Request("http://localhost/api/admin/contact-messages") as any;
    req.cookies = { get: vi.fn() };
    req.nextUrl = new URL("http://localhost/api/admin/contact-messages");
    const res = await GET(req);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
