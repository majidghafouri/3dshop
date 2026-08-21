"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const STATUS_STYLES: Record<(typeof STATUSES)[number], string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PAID: "bg-blue-100 text-blue-700 border-blue-300",
  PROCESSING: "bg-indigo-100 text-indigo-700 border-indigo-300",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-300",
  DELIVERED: "bg-green-100 text-green-700 border-green-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
};

export default function OrderStatusFilter({
  basePath,
  selected,
  counts,
  labels,
  allLabel,
}: {
  basePath: string;
  selected: string[];
  counts: Record<string, number>;
  labels: Record<string, string>;
  allLabel: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const apply = (next: string[]) => {
    const qs = next.length ? `?status=${next.join(",")}` : "";
    startTransition(() => router.replace(`${basePath}${qs}`, { scroll: false }));
  };

  const toggle = (s: string) =>
    apply(selected.includes(s) ? selected.filter((x) => x !== s) : [...selected, s]);

  return (
    <div
      className={`flex items-center gap-1.5 flex-wrap transition-opacity ${
        pending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <button
        onClick={() => apply([])}
        className={`px-3.5 py-1.5 rounded-full text-[12px] font-[950] border transition-colors ${
          selected.length === 0
            ? "text-white border-transparent"
            : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--primary)] hover:border-[var(--line-2)]"
        }`}
        style={
          selected.length === 0
            ? { backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }
            : undefined
        }
      >
        {allLabel}
      </button>

      {STATUSES.map((s) => {
        const active = selected.includes(s);
        return (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-[950] border transition-colors ${
              active
                ? STATUS_STYLES[s]
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--primary)] hover:border-[var(--line-2)]"
            }`}
          >
            {labels[s] ?? s}
            <span
              className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-[950] flex items-center justify-center ${
                active ? "bg-black/10" : "bg-[var(--soft)] text-[var(--muted)]"
              }`}
              dir="ltr"
            >
              {counts[s] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
