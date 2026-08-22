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

export default function ActivityHeatmap({
  series,
  dict,
  locale,
}: {
  series: DailyActivity[];
  dict: HeatmapDict;
  locale: string;
}) {
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

  // Weekday labels for rows 1/3/5 (Mon/Wed/Fri) taken from first full week
  const weekdayLabels = new Map<number, string>();
  for (const row of [1, 3, 5]) {
    const ref = weeks[1]?.[row];
    if (ref) weekdayLabels.set(row, wdFmt.format(new Date(`${ref.date}T00:00:00Z`)));
  }

  // Month labels above columns when a new month starts within the week
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

  const tipPos = (wi: number, ri: number): CSSProperties => {
    const n = weeks.length;
    const horiz: CSSProperties =
      wi >= n - 7 ? { right: "-8px" } : wi <= 1 ? { left: "-8px" } : { left: "50%", transform: "translateX(-50%)" };
    // top rows: show tooltip below the square so it never clips at the card edge
    return ri <= 2 ? { top: "calc(100% + 6px)", ...horiz } : { bottom: "calc(100% + 6px)", ...horiz };
  };

  return (
    <div dir="ltr">
      <div className="overflow-x-auto pb-1">
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
                      <div key={ri} className="relative group">
                        <div
                          className="w-[11px] h-[11px] rounded-[3px] transition-transform duration-150 group-hover:scale-125"
                          style={{ background: COLORS[bucket(cell.views)] }}
                        />
                        <div
                          className="absolute hidden group-hover:flex flex-col gap-0.5 bg-black/85 text-white text-[10.5px] font-[850] rounded-[8px] px-2.5 py-1.5 whitespace-nowrap z-20 shadow-lg pointer-events-none"
                          style={tipPos(wi, ri)}
                        >
                          <span className="opacity-80">{dateFmt.format(new Date(`${cell.date}T00:00:00Z`))}</span>
                          <span>👁 {dict.views}: {cell.views.toLocaleString("en-US")}</span>
                          <span>🧑‍🤝‍🧑 {dict.uniqueVisitors}: {cell.uniqueUsers.toLocaleString("en-US")}</span>
                          <span>✅ {dict.registeredUsers}: {cell.registeredUsers.toLocaleString("en-US")}</span>
                          <span>👤 {dict.guestUsers}: {cell.guestUsers.toLocaleString("en-US")}</span>
                        </div>
                      </div>
                    ) : (
                      <div key={ri} className="w-[11px] h-[11px]" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
