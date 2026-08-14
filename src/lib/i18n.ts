export const locales = ["fa", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale): string {
  return locale === "fa" ? "" : `/${locale}`;
}

export function localizePath(path: string, to: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return localePrefix(to) || "/";
  return `${localePrefix(to)}${clean}`;
}

export function switchLocalePath(path: string, from: Locale, to: Locale, search?: string): string {
  const unprefixed = path.replace(new RegExp(`^/(${locales.join("|")})`), "") || "/";
  const base = localizePath(unprefixed, to);
  return search ? `${base}${search}` : base;
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export function formatPrice(amount: number, locale: Locale): string {
  const n = new Intl.NumberFormat("en-US").format(amount);
  if (locale === "fa") return `${n} تومان`;
  if (locale === "ar") return `${n} تومان`;
  return `${n} Toman`;
}

export function formatDiscountPercent(price: number, compareAt?: number | null): number | null {
  if (!compareAt || compareAt <= price || price <= 0) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatDate(date: Date, locale: Locale): string {
  const dateLocale = locale === "fa" ? "fa-IR" : locale === "ar" ? "ar" : "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
