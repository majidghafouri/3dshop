"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CancelDict = {
  cancel: string;
  canceling: string;
  cancelConfirm: string;
  cancelSuccess: string;
  cancelFailed: string;
  cancelLimit: string;
  cancelLimitGeneric: string;
};

export default function CancelOrderButton({
  orderId,
  orderNumber,
  dict,
}: {
  orderId: string;
  orderNumber: number;
  dict: CancelDict;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const cancel = async () => {
    if (!window.confirm(dict.cancelConfirm)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setMsg({ kind: "ok", text: dict.cancelSuccess });
        router.refresh();
        return;
      }
      if (json.error === "cancel_limit" && json.retryAfterMs != null) {
        const minutes = Math.max(1, Math.ceil(json.retryAfterMs / 60000));
        setMsg({ kind: "err", text: dict.cancelLimit.replace("{minutes}", String(minutes)) });
        return;
      }
      if (json.error === "cancel_limit") {
        setMsg({ kind: "err", text: dict.cancelLimitGeneric });
        return;
      }
      setMsg({ kind: "err", text: dict.cancelFailed });
    } catch {
      setMsg({ kind: "err", text: dict.cancelFailed });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={cancel}
        disabled={busy}
        className="rounded-[12px] font-[950] px-5 py-2.5 text-[12.5px] border border-[var(--danger)]/30 text-[var(--danger)] bg-[var(--danger-softer)] hover:bg-[var(--danger-soft)] transition-all disabled:opacity-50"
      >
        {busy ? dict.canceling : `${dict.cancel} #${orderNumber}`}
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
