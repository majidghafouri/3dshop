"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { DailyActivity } from "@/lib/analytics";

type HeatmapDict = {
  activity: string;
  views: string;
  uniqueVisitors: string;
  registeredUsers: string;
  guestUsers: string;
  less: string;
  more: string;
};

const COLORS = [
  "var(--hm-empty)",
  "rgba(var(--primary-rgb),0.35)",
  "rgba(var(--primary-rgb),0.55)",
  "rgba(var(--primary-rgb),0.78)",
  "var(--primary)",
];

const TIP_HALF = 95;

export default function ActivityHeatmap({
  series,
  dict,
  locale,
}: {
  series: DailyActivity[];
  dict: HeatmapDict;
  locale: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tip, setTip] = useState<{ cell: DailyActivity; style: CSSProperties } | null>(null);

  if (series.length === 0) return null;

  const max = Math.max(...series.map((d) => d.views), 1);
  const bucket = (v: number) =>
    v === 0 ? 0 : v <= max * 0.25 ? 1 : v <= max * 0.5 ? 2 : v <= max * 0.75 ? 3 : 4;

  const firstDow = new Date(`${series[0].date}T00:00:00Z`).getUTCDay();
  const cells: (DailyActivity | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...series,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (DailyActivity | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const dateFmt = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const wdFmt = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : locale, { weekday: "short" });
  const moFmt = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : locale, { month: "short", timeZone: "UTC" });

  const weekdayLabels = new Map<number, string>();
  for (const row of [1, 3, 5]) {
    const ref = weeks[1]?.[row];
    if (ref) weekdayLabels.set(row, wdFmt.format(new Date(`${ref.date}T00:00:00Z`)));
  }

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, col) => {
    const cell = w.find(Boolean);
    if (!cell) return;
    const d = new Date(`${cell.date}T00:00:00Z`);
    if (d.getUTCMonth() !== lastMonth) {
      lastMonth = d.getUTCMonth();
      monthLabels.push({ col, label: moFmt.format(d) });
    }
  });

  // Tooltip is anchored to the whole heatmap frame (the parent card), never
  // inside the scrollable/clipped grid, so it can never be cropped.
  const show = (cell: DailyActivity, el: HTMLElement) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const sr = el.getBoundingClientRect();
    const cx = sr.left - wr.left + sr.width / 2;
    const topY = sr.top - wr.top;
    const x = Math.min(Math.max(cx, TIP_HALF), Math.max(wr.width - TIP_HALF, TIP_HALF));
    const style: CSSProperties =
      topY < 110
        ? { left: x, top: topY + sr.height + 10 }
        : { left: x, bottom: wr.height - topY + 10 };
    setTip({ cell, style });
  };

  return (
    <div ref={wrapRef} className="relative" dir="ltr">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* month labels */}
          <div className="flex gap-[3px] mb-1.5 text-[10px] font-[850] text-[var(--muted-2)]">
            {weeks.map((_, col) => {
              const m = monthLabels.find((x) => x.col === col);
              return (
                <span key={col} className="w-[11px] shrink-0 overflow-visible whitespace-nowrap">
                  {m?.label ?? ""}
                </span>
              );
            })}
          </div>

          <div className="flex gap-[6px]">
            {/* weekday labels */}
            <div className="flex flex-col gap-[3px] text-[9.5px] font-[850] text-[var(--muted-2)] shrink-0">
              {[0, 1, 2, 3, 4, 5, 6].map((r) => (
                <span key={r} className="h-[11px] leading-[11px] w-[26px]">
                  {weekdayLabels.get(r) ?? ""}
                </span>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((w, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {w.map((cell, ri) =>
                    cell ? (
                      <div
                        key={ri}
                        className="w-[11px] h-[11px] rounded-[3px] transition-transform duration-150 hover:scale-125 cursor-pointer"
                        style={{ background: COLORS[bucket(cell.views)] }}
                        onMouseEnter={(e) => show(cell, e.currentTarget)}
                        onMouseLeave={() => setTip(null)}
                      />
                    ) : (
                      <div key={ri} className="w-[11px] h-[11px]" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* card-level tooltip */}
      {tip && (
        <div
          className="absolute z-30 flex flex-col gap-0.5 bg-black/85 text-white text-[10.5px] font-[850] rounded-[8px] px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none w-max"
          style={tip.style}
        >
          <span className="opacity-80">{dateFmt.format(new Date(`${tip.cell.date}T00:00:00Z`))}</span>
          <span>👁 {dict.views}: {tip.cell.views.toLocaleString("en-US")}</span>
          <span>🧑‍🤝‍🧑 {dict.uniqueVisitors}: {tip.cell.uniqueUsers.toLocaleString("en-US")}</span>
          <span>✅ {dict.registeredUsers}: {tip.cell.registeredUsers.toLocaleString("en-US")}</span>
          <span>👤 {dict.guestUsers}: {tip.cell.guestUsers.toLocaleString("en-US")}</span>
        </div>
      )}

      {/* legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] font-[850] text-[var(--muted-2)]">
        <span>{dict.less}</span>
        {COLORS.map((c) => (
          <span key={c} className="w-[11px] h-[11px] rounded-[3px]" style={{ background: c }} />
        ))}
        <span>{dict.more}</span>
      </div>
    </div>
  );
}
