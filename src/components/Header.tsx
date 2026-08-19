"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Locale, localePrefix, locales, switchLocalePath } from "@/lib/i18n";
import { Dictionary } from "@/lib/i18n-dictionaries";
import { buildNav } from "@/lib/nav";
import Logo from "@/components/Logo";
import LangSwitcher from "@/components/LangSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import MusicToggle from "@/components/MusicToggle";
import SearchBox from "@/components/SearchBox";
import { useCart } from "@/components/CartProvider";

type User = { phone: string | null; role: string } | null;

const localeLabels: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
};

export default function Header({
  locale,
  dict,
  user,
}: {
  locale: Locale;
  dict: Dictionary;
  user: User;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = pathname.includes("/admin");

  const nav = buildNav(dict, locale);
  const prefix = localePrefix(locale);
  const cartHref = `${prefix}/cart`;
  const accountHref = user ? `${prefix}/account` : `${prefix}/auth`;
  const matches = (href?: string) => {
    if (!href) return false;
    const qIndex = href.indexOf("?");
    const target = qIndex === -1 ? href : href.slice(0, qIndex);
    if (target === `${prefix}/` || target === prefix || target === "") {
      return pathname === `${prefix}/` || pathname === prefix || pathname === "";
    }
    if (!pathname.startsWith(target)) return false;
    if (qIndex !== -1) {
      const q = new URLSearchParams(href.slice(qIndex + 1));
      return Array.from(q.entries()).every(([k, v]) => searchParams.get(k) === v);
    }
    // A plain link like /products must not stay highlighted on a filtered
    // variant that has its own nav item (e.g. /products?discount=1).
    if (searchParams.get("discount") === "1") return false;
    return true;
  };

  return (
    <header
      id="topbar"
      className="fixed inset-x-0 top-0 z-50 h-[76px] max-sm:h-[68px] transition-shadow duration-250 ease-in-out bg-[var(--glass-90)] border-b border-[var(--line-glass)]"
      style={{ backdropFilter: "blur(18px)" }}
    >
      <div className="h-full w-[min(1188px,calc(100%-40px))] mx-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[18px] max-xl:gap-[8px]">
        <Logo locale={locale} />

        {/* Desktop nav */}
        {!isAdmin && (
          <nav
            aria-label={dict.nav.openMenu}
            className="hidden xl:flex items-center justify-center gap-[2px] min-w-0"
          >
          {nav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.children ? item.label : null)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    className={`nav-pill flex items-center gap-1 ${
                      matches(item.children[0]?.href) ? "text-[var(--primary)] bg-[var(--soft)]" : ""
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full right-1/2 translate-x-1/2 pt-3 w-[260px]">
                      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-2.5 shadow-[0_22px_70px_rgba(27,54,115,0.14)]">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={`block px-4 py-3 rounded-[16px] font-[900] text-[14px] transition-colors duration-200 hover:bg-[var(--soft)] hover:text-[var(--primary)] ${
                              matches(c.href) ? "text-[var(--primary)] bg-[var(--soft-2)]" : "text-[var(--text-6)]"
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`nav-pill ${
                    matches(item.href) ? "text-[var(--primary)] bg-[var(--soft)]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          </nav>
        )}

        {/* Right actions */}
        {!isAdmin && (
        <div className="flex items-center justify-end gap-2.5 max-xl:gap-2">
          <SearchBox locale={locale} dict={dict} />
          <div className="max-sm:hidden flex items-center gap-2.5 max-xl:gap-2">
            <MusicToggle />
            <ThemeToggle />
            <LangSwitcher locale={locale} dict={dict} />
          </div>

          <Link
            href={cartHref}
            aria-label={dict.nav.cart}
            className="relative flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--glass-94)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M6 8h12l-1.2 11.1a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9L6 8z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--sky)] text-white text-[11px] font-[950] flex items-center justify-center shadow-[0_6px_16px_rgba(var(--primary-rgb),0.4)]">
                {count}
              </span>
            )}
          </Link>

          <Link
            href={accountHref}
            aria-label={dict.nav.account}
            className="hidden sm:flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--glass-94)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5" />
            </svg>
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href={`${prefix}/admin`}
              aria-label={dict.nav.admin}
              className="hidden sm:flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--glass-94)] text-[var(--primary)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={dict.nav.openMenu}
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden w-[45px] h-[45px] max-sm:w-[42px] max-sm:h-[42px] bg-[var(--soft)] rounded-[14px] text-[var(--text)] flex items-center justify-center text-[20px]"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
        )}

        {isAdmin && (
          <div className="flex items-center justify-end gap-2.5">
            <SearchBox locale={locale} dict={dict} />
            <div className="max-sm:hidden flex items-center gap-2.5">
              <MusicToggle />
              <LangSwitcher locale={locale} dict={dict} />
            </div>
            <ThemeToggle />
            <Link
              href={accountHref}
              aria-label={dict.nav.account}
              className="flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--glass-94)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile dropdown panel */}
      {!isAdmin && mobileOpen && (
        <div className="xl:hidden fixed top-[76px] max-sm:top-[68px] inset-x-4 flex flex-col items-stretch bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-3 shadow-[0_22px_70px_rgba(27,54,115,0.14)] max-h-[calc(100vh-100px)] overflow-y-auto z-50">
          {nav.map((item) => {
            if (item.children) {
              const isOpen = mobileOpenDropdown === item.label;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setMobileOpenDropdown(isOpen ? null : item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] font-[900] text-[15px] text-[var(--text-4)] hover:bg-[var(--soft)]"
                  >
                    {item.label}
                    <svg className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                  {isOpen && (
                    <div className="mr-3 pr-2 border-r border-[var(--line)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 rounded-[14px] font-[800] text-[14px] text-[var(--text-3)] hover:bg-[var(--soft)] hover:text-[var(--primary)]"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-[16px] font-[900] text-[15px] hover:bg-[var(--soft)] ${
                  matches(item.href) ? "text-[var(--primary)] bg-[var(--soft)]" : "text-[var(--text-4)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-[var(--line)] pt-2">
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-[16px] font-[900] text-[15px] text-[var(--primary)] hover:bg-[var(--soft)]"
            >
              {user ? dict.nav.account : dict.nav.login}
            </Link>

            <div className="mt-2 flex items-center justify-around gap-2">
              <MusicToggle />
              <ThemeToggle />
            </div>

            <div className="mt-3">
              <p className="px-4 text-[12px] font-[950] text-[var(--muted-2)]">
                {dict.nav.chooseLanguage}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {locales.map((l) => {
                  const active = l === locale;
                  const query = searchParams.toString();
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        const href = switchLocalePath(pathname, locale, l, query ? `?${query}` : undefined);
                        window.history.replaceState(window.history.state, "", href);
                        setMobileOpen(false);
                        router.refresh();
                      }}
                      className={`px-3 py-2.5 rounded-[14px] text-[13px] font-[950] text-center border transition-colors ${
                        active
                          ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--soft)]"
                          : "border-[var(--line-2)] text-[var(--text-3)] hover:border-[var(--line-strong)]"
                      }`}
                    >
                      {localeLabels[l]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
