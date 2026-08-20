import { describe, it, expect } from "vitest";
import {
  locales,
  isLocale,
  localePrefix,
  getDir,
  formatPrice,
  formatDiscountPercent,
  formatDate,
  switchLocalePath,
  localizePath,
} from "@/lib/i18n";

describe("isLocale", () => {
  it("returns true for valid locales", () => {
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
  });

  it("returns false for invalid locales", () => {
    expect(isLocale("de")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale("FA")).toBe(false);
  });
});

describe("localePrefix", () => {
  it("returns empty string for default locale (fa)", () => {
    expect(localePrefix("fa")).toBe("");
  });

  it("returns /en for English", () => {
    expect(localePrefix("en")).toBe("/en");
  });

  it("returns /ar for Arabic", () => {
    expect(localePrefix("ar")).toBe("/ar");
  });
});

describe("getDir", () => {
  it("returns ltr for English", () => {
    expect(getDir("en")).toBe("ltr");
  });

  it("returns rtl for Farsi", () => {
    expect(getDir("fa")).toBe("rtl");
  });

  it("returns rtl for Arabic", () => {
    expect(getDir("ar")).toBe("rtl");
  });
});

describe("formatPrice", () => {
  it("formats price in Farsi with toman", () => {
    const result = formatPrice(150000, "fa");
    expect(result).toContain("150,000");
    expect(result).toContain("تومان");
  });

  it("formats price in English with Toman", () => {
    const result = formatPrice(250000, "en");
    expect(result).toContain("250,000");
    expect(result).toContain("Toman");
  });

  it("formats zero correctly", () => {
    expect(formatPrice(0, "fa")).toContain("0");
  });
});

describe("formatDiscountPercent", () => {
  it("returns correct percentage", () => {
    expect(formatDiscountPercent(80000, 100000)).toBe(20);
  });

  it("returns null when no compare price", () => {
    expect(formatDiscountPercent(100000, null)).toBeNull();
    expect(formatDiscountPercent(100000, undefined)).toBeNull();
  });

  it("returns null when compare <= price", () => {
    expect(formatDiscountPercent(100000, 100000)).toBeNull();
    expect(formatDiscountPercent(100000, 80000)).toBeNull();
  });

  it("returns null when price is 0", () => {
    expect(formatDiscountPercent(0, 100000)).toBeNull();
  });
});

describe("localizePath", () => {
  it("adds locale prefix to path", () => {
    expect(localizePath("/products", "en")).toBe("/en/products");
  });

  it("returns / for fa root", () => {
    expect(localizePath("/", "fa")).toBe("/");
  });

  it("returns /en for en root", () => {
    expect(localizePath("/", "en")).toBe("/en");
  });
});

describe("switchLocalePath", () => {
  it("switches from fa to en", () => {
    expect(switchLocalePath("/products", "fa", "en")).toBe("/en/products");
  });

  it("switches from en to fa", () => {
    expect(switchLocalePath("/en/products", "en", "fa")).toBe("/products");
  });

  it("preserves search params", () => {
    expect(switchLocalePath("/products", "fa", "en", "?page=2")).toBe(
      "/en/products?page=2"
    );
  });
});
