"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

type ReorderDict = {
  reorder: string;
  reordering: string;
  reorderFailed: string;
  reorderPartial: string;
};

export default function ReorderOrderButton({
  orderId,
  prefix,
  dict,
}: {
  orderId: string;
  prefix: string;
  dict: ReorderDict;
}) {
  const router = useRouter();
  const { refresh: refreshCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const reorder = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/reorder`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        if (json.data.skipped?.length) {
          setMsg({ kind: "ok", text: dict.reorderPartial });
        }
        await refreshCart();
        setTimeout(() => router.push(`${prefix}/cart`), 600);
        return;
      }
      setMsg({ kind: "err", text: dict.reorderFailed });
    } catch {
      setMsg({ kind: "err", text: dict.reorderFailed });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={reorder}
        disabled={busy}
        className="rounded-[12px] font-[950] px-5 py-2.5 text-[12.5px] border border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--soft)] hover:bg-[var(--line-4)] transition-all disabled:opacity-50"
      >
        {busy ? dict.reordering : `↻ ${dict.reorder}`}
      </button>
      {msg && (
        <p
          className={`text-[12px] font-[850] ${
            msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
