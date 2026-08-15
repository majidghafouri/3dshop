"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PayDict = {
  pay: string;
  paying: string;
  payFailed: string;
};

export default function PayOrderButton({
  orderId,
  prefix,
  dict,
}: {
  orderId: string;
  prefix: string;
  dict: PayDict;
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
        router.push(`${prefix}/pay/${orderId}`);
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
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[12.5px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {busy ? dict.paying : dict.pay}
      </button>
      {msg && <p className="text-[12px] font-[850] text-[var(--danger)]">{msg}</p>}
    </div>
  );
}
