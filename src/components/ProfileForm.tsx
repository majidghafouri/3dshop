"use client";

import { useState } from "react";
import { Dictionary } from "@/lib/i18n-dictionaries";

type Props = {
  dict: Dictionary;
  user: { name: string | null; phone: string | null; email: string | null };
};

export default function ProfileForm({ dict, user }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(
          json.error === "invalid_phone"
            ? dict.account.errorInvalidPhone
            : json.error === "phone_taken"
              ? dict.account.errorPhoneTaken
              : dict.account.errorSaveFailed,
        );
        return;
      }
      setSaved(true);
    } catch {
      setError(dict.account.errorSaveFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.05)] space-y-4">
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.account.profileTitle}</h2>

      {user.email && (
        <div>
          <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.email}</span>
          <p className="mt-1.5 text-[14px] font-[900] text-[var(--text)]" dir="ltr">{user.email}</p>
        </div>
      )}

      <label className="block">
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.name}</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.account.namePlaceholder}
          className="mt-2 w-full border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
        />
      </label>

      <label className="block">
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.phone}</span>
        <input
          type="tel"
          inputMode="numeric"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09123456789"
          className="mt-2 w-full border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
        />
      </label>

      {error && (
        <p className="text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-[13px] font-[850] text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-soft-3)] rounded-[12px] px-3 py-2.5">
          {dict.account.saved}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[16px] text-white font-[950] py-3.5 text-[15px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {busy ? dict.common.loading : dict.account.saveProfile}
      </button>
    </form>
  );
}
