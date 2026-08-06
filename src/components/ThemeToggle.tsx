"use client";

import { useEffect, useState } from "react";
import { Theme, getStoredTheme, applyTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  return (
    <button
      type="button"
      aria-label="toggle theme"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        applyTheme(next);
        setTheme(next);
      }}
      className="flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] bg-[var(--surface)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)]"
    >
      {theme === "dark" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
