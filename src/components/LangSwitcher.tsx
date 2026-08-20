"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Locale, locales, switchLocalePath } from "@/lib/i18n";
import { Dictionary } from "@/lib/i18n-dictionaries";

const labels: Record<Locale, { name: string; code: string }> = {
  fa: { name: "فارسی", code: "FA" },
  en: { name: "English", code: "EN" },
  ar: { name: "العربية", code: "AR" },
};

export default function LangSwitcher({
  locale,
  dict,
  onSwitch,
}: {
  locale: Locale;
  dict: Dictionary;
  onSwitch?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={dict.nav.chooseLanguage}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 min-h-[46px] max-sm:min-h-[42px] border border-[var(--line-3)] bg-[var(--glass-94)] rounded-full px-3 transition-all duration-220 text-[var(--text-9)] hover:border-[var(--line-strong)] hover:shadow-[0_14px_34px_rgba(29,59,124,0.14)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
      >
        <span className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--bg-tint)] to-[var(--surface)] text-[var(--primary)] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
          </svg>
        </span>
        <span className="text-[13.5px] font-[950] min-w-[44px]">
          {labels[locale].name}
        </span>
        <span className="w-[8px] h-[8px] rounded-full bg-[var(--teal)] anim-pulse-dot" />
        <svg
          className={`w-[24px] h-[24px] bg-[var(--bg-tint)] text-[var(--text)] rounded-full p-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full ltr:left-0 rtl:right-0 mt-3 min-w-[226px] bg-[var(--glass-98)] border border-[var(--line-2)] rounded-[24px] p-2.5 shadow-[0_22px_70px_rgba(27,54,115,0.14)] backdrop-blur-[16px] z-50"
        >
          {locales.map((l) => {
            const query = searchParams.toString();
            const href = switchLocalePath(
              pathname,
              locale,
              l,
              query ? `?${query}` : undefined,
            );
            const active = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSwitch?.();
                  router.replace(href);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-[13px] py-3 rounded-[16px] font-[900] text-[14px] text-[var(--text-6)] transition-colors duration-200 hover:bg-[var(--bg-tint)] ${
                  active ? "bg-[var(--soft-2)] text-[var(--primary)]" : ""
                }`}
              >
                <span>{labels[l].name}</span>
                <span className="flex items-center gap-2">
                  <span className={`text-[11px] font-[950] tracking-[0.04em] ${active ? "text-[var(--primary)]" : "text-[var(--muted-6)]"}`}>
                    {labels[l].code}
                  </span>
                  {active && (
                    <span className="text-[11px] font-[950] text-[var(--success-2)] bg-[var(--success-soft-4)] rounded-full px-2.5 py-0.5">
                      {dict.nav.active}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
