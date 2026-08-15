"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function format(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function MiniCountdown({
  deadline,
  expiredLabel,
}: {
  deadline: string;
  expiredLabel: string;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(
    () => new Date(deadline).getTime() - Date.now()
  );
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const left = new Date(deadline).getTime() - Date.now();
      setRemaining(left);
      if (left <= 0 && !notified) {
        setNotified(true);
        router.refresh();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, notified, router]);

  if (remaining <= 0) {
    return (
      <span className="text-[12px] font-[850] text-[var(--danger)]">
        ⏳ {expiredLabel}
      </span>
    );
  }

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1 text-[12px] font-[950] text-[var(--warning-text)] tabular-nums"
    >
      <span className="text-[13px]">⏳</span> {format(remaining)}
    </span>
  );
}
