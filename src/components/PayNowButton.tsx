"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PayNowDict = {
  pay: string;
  paying: string;
  payFailed: string;
};

export default function PayNowButton({
  orderId,
  dict,
}: {
  orderId: string;
  dict: PayNowDict;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pay = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        router.refresh();
        return;
      }
      setMsg(dict.payFailed);
    } catch {
      setMsg(dict.payFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="rounded-[14px] text-white font-[950] px-8 py-3 text-[13.5px] shadow-[0_10px_24px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 transition-all"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {busy ? dict.paying : dict.pay}
      </button>
      {msg && <p className="text-[12px] font-[850] text-[var(--danger)]">{msg}</p>}
    </div>
  );
}
