"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dictionary } from "@/lib/i18n-dictionaries";
import { trackClient } from "@/lib/client-analytics";

export default function ProductSearchBar({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  const push = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("search", q);
      else params.delete("search");
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applySearch = () => {
    const q = query.trim();
    if (q) trackClient("SEARCH", { query: q });
    push(q);
  };

  const clearSearch = () => {
    setQuery("");
    push("");
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-2 pl-4 shadow-[0_14px_40px_rgba(29,59,124,0.05)]">
      <div className="flex items-center gap-2.5">
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder={dict.nav.searchPlaceholder}
          aria-label={dict.nav.search}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14.5px] font-[800] text-[var(--text)] placeholder:text-[var(--muted-2)]"
        />

        {hasQuery && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label={dict.products.filters.clear}
            className="shrink-0 grid place-items-center w-[34px] h-[34px] rounded-full text-[var(--muted-2)] hover:text-[var(--text)] hover:bg-[var(--soft)] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={applySearch}
          className="shrink-0 text-[13px] font-[950] text-white rounded-[14px] px-5 py-2.5 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {dict.nav.search}
        </button>
      </div>
    </div>
  );
}
