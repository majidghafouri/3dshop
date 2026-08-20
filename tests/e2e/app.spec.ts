import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/فیگرفورج|Figureforge/);
  });

  test("displays hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("h1");
    await expect(hero.first()).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("displays products section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/محصولات|Products/).first()).toBeVisible();
  });
});

test.describe("Products Page", () => {
  test("navigates to products listing", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveTitle(/محصولات|Products/);
  });

  test("displays product grid", async ({ page }) => {
    await page.goto("/products");
    const products = page.locator('[class*="grid"]');
    await expect(products.first()).toBeVisible();
  });
});

test.describe("i18n - Locale Switching", () => {
  test("loads Farsi locale by default", async ({ page }) => {
    await page.goto("/");
    const locale = page.locator("html");
    await expect(locale).toHaveAttribute("dir", "rtl");
  });

  test("loads English locale with /en prefix", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Figureforge/);
  });

  test("loads Arabic locale with /ar prefix", async ({ page }) => {
    await page.goto("/ar");
    await expect(page).toHaveTitle(/فيجرفورج/);
  });

  test("middleware rewrites unprefixed to fa", async ({ page }) => {
    await page.goto("/");
    const cookie = await page.context().cookies();
    const localeCookie = cookie.find((c) => c.name === "locale");
    expect(localeCookie?.value).toBe("fa");
  });
});

test.describe("Auth Page", () => {
  test("displays login form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByText(/ورود|Login/).first()).toBeVisible();
  });

  test("has email/phone input field", async ({ page }) => {
    await page.goto("/auth");
    const input = page.locator('input[type="text"], input[type="email"], input[placeholder*="ایمیل"], input[placeholder*="email"]').first();
    await expect(input).toBeVisible();
  });
});

test.describe("Cart Page", () => {
  test("displays empty cart message", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText(/سبد خرید|Shopping Cart/).first()).toBeVisible();
  });
});

test.describe("Blog Page", () => {
  test("navigates to blog listing", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/مجله|Blog/);
  });
});

test.describe("About Page", () => {
  test("navigates to about page", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/درباره|About/).first()).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test("navigates to contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(/تماس|Contact/).first()).toBeVisible();
  });

  test("displays contact form", async ({ page }) => {
    await page.goto("/contact");
    const textarea = page.locator("textarea").first();
    await expect(textarea).toBeVisible();
  });
});

test.describe("API Docs", () => {
  test("navigates to swagger docs", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.locator(".swagger-ui")).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Admin Protection", () => {
  test("redirects to auth when not logged in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/auth/);
  });
});

test.describe("Account Protection", () => {
  test("redirects to auth when not logged in", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/auth/);
  });
});

test.describe("Performance & SEO", () => {
  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute("content", /.+/);
  });

  test("homepage has lang attribute", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", /fa|en|ar/);
  });
});
