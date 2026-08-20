import { test, expect } from "@playwright/test";

test.describe("API Health Checks", () => {
  test("GET /api/auth/me returns valid response", async ({ request }) => {
    const res = await request.get("/api/auth/me");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("GET /api/docs returns OpenAPI spec", async ({ request }) => {
    const res = await request.get("/api/docs");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.openapi).toBeDefined();
  });

  test("POST /api/auth/send-otp rejects invalid input", async ({ request }) => {
    const res = await request.post("/api/auth/send-otp", {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/auth/login rejects invalid input", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/cart rejects missing productId", async ({ request }) => {
    const res = await request.post("/api/cart", {
      data: { quantity: 1 },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/contact rejects empty body", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test("Admin routes return 401 without auth", async ({ request }) => {
    const routes = [
      request.get("/api/admin/products"),
      request.get("/api/admin/categories"),
      request.get("/api/admin/coupons"),
      request.get("/api/admin/settings"),
      request.get("/api/admin/contact-messages"),
    ];

    const responses = await Promise.all(routes);
    for (const res of responses) {
      expect(res.status()).toBe(401);
    }
  });
});

test.describe("API Security Headers", () => {
  test("API responses have correct content-type", async ({ request }) => {
    const res = await request.get("/api/auth/me");
    const contentType = res.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });

  test("non-existent API routes return 404", async ({ request }) => {
    const res = await request.get("/api/nonexistent-route");
    expect(res.status()).toBe(404);
  });
});

test.describe("CORS & Method Validation", () => {
  test("GET on POST-only route returns 405 or error", async ({ request }) => {
    const res = await request.get("/api/auth/login");
    // Next.js returns 405 Method Not Allowed for wrong methods
    expect([405, 400, 500]).toContain(res.status());
  });

  test("POST on GET-only route returns 405 or error", async ({ request }) => {
    const res = await request.post("/api/auth/me", { data: {} });
    expect([405, 400, 500]).toContain(res.status());
  });
});
