"use client";

import { useEffect, useRef, useState } from "react";
import { MUSIC_EVENT, getMusicEnabled } from "@/lib/music";
import {
  subscribe,
  getState,
  playTrack,
  pausePlayback,
  toggleMute,
} from "@/lib/player";

export default function ProductMusicPlayer({
  url,
  title,
  label,
  credit,
}: {
  url: string;
  title: string;
  label: string;
  credit: string;
}) {
  const enabledRef = useRef(true);
  const urlRef = useRef(url);
  const [enabled, setEnabled] = useState(true);
  const [state, setState] = useState({ playing: false, muted: false });

  useEffect(() => {
    const initial = getMusicEnabled();
    enabledRef.current = initial;
    setEnabled(initial);
    const onChange = (e: Event) => {
      const next = (e as CustomEvent).detail?.enabled ?? true;
      enabledRef.current = next;
      setEnabled(next);
      if (!next) pausePlayback();
    };
    window.addEventListener(MUSIC_EVENT, onChange);
    return () => window.removeEventListener(MUSIC_EVENT, onChange);
  }, []);

  useEffect(() => {
    setState(getState());
    return subscribe(() => setState(getState()));
  }, []);

  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  useEffect(() => {
    if (!enabledRef.current) return;
    playTrack(url);
    return () => pausePlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  useEffect(() => {
    const onInteract = () => {
      if (!enabledRef.current) return;
      playTrack(urlRef.current);
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, onInteract, { once: false }));
    const onScroll = () => onInteract();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!url || !enabled) return null;

  const togglePlay = () => {
    if (!enabledRef.current) return;
    if (getState().playing) {
      pausePlayback();
    } else {
      playTrack(urlRef.current);
    }
  };

  return (
    <div className="fixed bottom-[20px] left-[20px] z-[60] max-sm:bottom-[14px] max-sm:left-[14px] max-sm:right-[14px]">
      <div className="flex items-center gap-3 rounded-[18px] border border-[var(--line-4)] bg-[var(--glass-92)] backdrop-blur-md px-3.5 py-2.5 shadow-[0_12px_36px_rgba(20,45,90,0.18)] max-sm:w-full">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={state.playing ? "pause" : "play"}
          className="grid place-items-center w-[38px] h-[38px] shrink-0 rounded-full text-white shadow-[0_8px_20px_rgba(52,84,209,0.3)] transition-transform hover:scale-105"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {state.playing ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1.4" />
              <rect x="14" y="4" width="4" height="16" rx="1.4" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[12px] font-[950] text-[var(--text)]">
            <span className="text-[var(--primary)]">♫</span>
            <span className="truncate">{label}</span>
          </p>
          <p className="text-[11px] font-[800] text-[var(--muted-3)] truncate" dir="ltr">
            {title} — {credit}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!enabledRef.current) return;
            toggleMute();
          }}
          aria-label={state.muted ? "unmute" : "mute"}
          className="grid place-items-center w-[34px] h-[34px] shrink-0 rounded-full text-[var(--text-3)] border border-[var(--soft-line)] bg-[var(--surface-2)] transition-colors hover:text-[var(--text)]"
        >
          {state.muted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
              <line x1="16" y1="9" x2="22" y2="15" />
              <line x1="22" y1="9" x2="16" y2="15" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
