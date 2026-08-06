"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dictionary } from "@/lib/i18n-dictionaries";

export default function LogoutButton({
  dict,
  prefix,
}: {
  dict: Dictionary;
  prefix: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`${prefix}/`);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="rounded-[14px] border border-[var(--danger-soft)] bg-[var(--danger-soft-2)] text-[var(--danger)] font-[950] px-5 py-2.5 text-[13px] hover:bg-[var(--danger-soft-2)] transition-colors disabled:opacity-60"
    >
      {busy ? dict.common.loading : dict.account.logout}
    </button>
  );
}
