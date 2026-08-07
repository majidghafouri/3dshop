"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export default function Marquee({
  children,
  maxWidth = 120,
  speed = 24,
  gap = 44,
  className = "",
}: {
  children: ReactNode;
  maxWidth?: number;
  speed?: number;
  gap?: number;
  className?: string;
}) {
  const copyRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const width = el.offsetWidth || 100;
    setDuration(Math.max(5, width / speed));
    setRtl(getComputedStyle(el).direction === "rtl");
  }, [children, speed]);

  return (
    <span
      dir="ltr"
      className={`inline-flex items-center overflow-hidden align-middle whitespace-nowrap ${className}`}
      style={{ maxWidth }}
    >
      <span
        className="inline-flex items-center"
        style={
          duration
            ? { animation: `${rtl ? "marquee-rtl" : "marquee"} ${duration}s linear infinite` }
            : undefined
        }
      >
        <span ref={copyRef} dir="auto" className="inline-flex items-center" style={{ paddingRight: gap }}>
          {children}
        </span>
        <span dir="auto" className="inline-flex items-center" aria-hidden="true" style={{ paddingRight: gap }}>
          {children}
        </span>
      </span>
    </span>
  );
}
