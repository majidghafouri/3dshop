"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  name,
  dict,
}: {
  id: string;
  name: string;
  dict: { label: string; confirm: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const del = async () => {
    if (!confirm(dict.confirm.replace("{name}", name))) return;
    setBusy(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    setBusy(false);
    if (json.ok) router.refresh();
  };

  return (
    <button
      type="button"
      onClick={del}
      disabled={busy}
      className="text-[12px] font-[950] text-[var(--danger)] hover:underline disabled:opacity-50"
    >
      {busy ? "..." : dict.label}
    </button>
  );
}
