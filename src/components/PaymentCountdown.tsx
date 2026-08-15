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

export default function PaymentCountdown({
  deadline,
  label,
  expiredLabel,
}: {
  deadline: string;
  label: string;
  expiredLabel: string;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(() => new Date(deadline).getTime() - Date.now());
  const [expiredNotified, setExpiredNotified] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const left = new Date(deadline).getTime() - Date.now();
      setRemaining(left);
      if (left <= 0 && !expiredNotified) {
        setExpiredNotified(true);
        router.refresh();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, expiredNotified, router]);

  const expired = remaining <= 0;

  return (
    <div className="mt-4 rounded-[14px] border border-[var(--warning-soft-2)] bg-[var(--warning-soft)] px-4 py-3">
      <p className="text-[12.5px] font-[850] text-[var(--warning-text)]">
        ⏳ {expired ? expiredLabel : `${label} `}
      </p>
      {!expired && (
        <p
          dir="ltr"
          className="mt-1 text-[20px] font-[1000] text-[var(--warning-text)] tabular-nums"
        >
          {format(remaining)}
        </p>
      )}
    </div>
  );
}
