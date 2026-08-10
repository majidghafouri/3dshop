"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dictionary } from "@/lib/i18n-dictionaries";
import { Locale, localePrefix } from "@/lib/i18n";
import { trackClient } from "@/lib/client-analytics";

export default function SearchBox({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    trackClient("SEARCH", { query: q });
    setOpen(false);
    setQuery("");
    router.push(
      `${localePrefix(locale)}/products?search=${encodeURIComponent(q)}`
    );
  };

  return (
    <>
      <button
        type="button"
        aria-label={dict.nav.search}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--glass-94)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[76px] max-sm:top-[68px] z-[70] px-4">
          <div
            className="mx-auto w-[min(640px,100%)] flex items-center gap-2 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-[0_22px_70px_rgba(27,54,115,0.16)]"
            style={{ backdropFilter: "blur(18px)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={dict.nav.searchPlaceholder}
              aria-label={dict.nav.search}
              className="flex-1 min-w-0 bg-transparent outline-none text-[14.5px] font-[800] text-[var(--text)] placeholder:text-[var(--muted-2)]"
            />
            <button
              type="button"
              onClick={submit}
              className="shrink-0 text-[12.5px] font-[950] text-white rounded-[12px] px-4 py-2 transition-transform hover:scale-[1.03]"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {dict.nav.search}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.common.close}
              className="shrink-0 grid place-items-center w-[34px] h-[34px] rounded-full text-[var(--muted-2)] hover:text-[var(--text)] hover:bg-[var(--soft)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
