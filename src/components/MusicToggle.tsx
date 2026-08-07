"use client";

import { useEffect, useState } from "react";
import { MUSIC_EVENT, getMusicEnabled, setMusicEnabled } from "@/lib/music";

export default function MusicToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getMusicEnabled());
    const onChange = (e: Event) =>
      setEnabled((e as CustomEvent).detail?.enabled ?? true);
    window.addEventListener(MUSIC_EVENT, onChange);
    return () => window.removeEventListener(MUSIC_EVENT, onChange);
  }, []);

  return (
    <button
      type="button"
      aria-label={enabled ? "background music on" : "background music off"}
      aria-pressed={enabled}
      onClick={() => {
        const next = !enabled;
        setMusicEnabled(next);
        setEnabled(next);
      }}
      className={`flex items-center justify-center w-[46px] h-[46px] max-sm:w-[42px] max-sm:h-[42px] rounded-full border border-[var(--line-3)] text-[var(--text)] transition-all duration-220 hover:border-[var(--line-strong)] hover:-translate-y-px shadow-[0_10px_28px_rgba(29,59,124,0.06)] ${
        enabled ? "bg-[var(--surface)]" : "bg-[var(--soft)] text-[var(--muted-3)]"
      }`}
    >
      {enabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
          <path d="M3 3l18 18" />
        </svg>
      )}
    </button>
  );
}
