"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function OrderStatusSelect({
  orderId,
  status,
  statuses,
}: {
  orderId: string;
  status: string;
  statuses: Record<string, string>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const update = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusy(true);
    const res = await fetch(`/api/orders/admin/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) router.refresh();
  };

  return (
    <select
      value={status}
      onChange={update}
      disabled={busy}
      className="border border-[var(--line-2)] rounded-[10px] px-2.5 py-1.5 text-[12px] font-[900] text-[var(--text-3)] outline-none bg-[var(--surface)] disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{statuses[s] ?? s}</option>
      ))}
    </select>
  );
}
