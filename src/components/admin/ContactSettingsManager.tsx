"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ContactSettingsDict = {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  fa: string;
  en: string;
  ar: string;
  save: string;
  saved: string;
  error: string;
};

const KEYS = {
  phone: "contact_phone",
  email: "contact_email",
  addressFa: "contact_address_fa",
  addressEn: "contact_address_en",
  addressAr: "contact_address_ar",
  hoursFa: "contact_hours_fa",
  hoursEn: "contact_hours_en",
  hoursAr: "contact_hours_ar",
} as const;

export default function ContactSettingsManager({ dict }: { dict: ContactSettingsDict }) {
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(Object.values(KEYS).map((k) => [k, ""])),
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = await res.json();
        if (json.ok) {
          const rows: { key: string; value: string }[] = json.data.settings ?? [];
          const next = { ...vals };
          for (const k of Object.values(KEYS)) {
            const row = rows.find((r) => r.key === k);
            if (row) next[k] = row.value;
          }
          setVals(next);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      const calls = Object.entries(KEYS).map(([, key]) =>
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            value: vals[key] ?? "",
            group: "contact",
            isSecret: false,
          }),
        }).then((r) => r.json()),
      );
      const results = await Promise.all(calls);
      if (results.every((r) => r.ok)) {
        showMsg("ok", dict.saved);
        router.refresh();
      } else {
        const err = results.find((r) => !r.ok)?.error ?? "unknown";
        showMsg("err", `${dict.error}: ${err}`);
      }
    } catch {
      showMsg("err", dict.error);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  const field = (key: string, label: string, placeholder: string, dir: "ltr" | "rtl" = "ltr") => (
    <label className="block">
      <span className="text-[12px] font-[900] text-[var(--text-2)]">{label}</span>
      <input
        value={vals[key]}
        onChange={(e) => setVals((v) => ({ ...v, [key]: e.target.value }))}
        placeholder={placeholder}
        dir={dir}
        className={`${inputCls} mt-1.5`}
      />
    </label>
  );

  const localeField = (key: string, localeLabel: string) => (
    <div className="flex items-end gap-3">
      <span className="shrink-0 text-[12px] font-[950] text-[var(--muted)] pb-3">{localeLabel}</span>
      <input
        value={vals[key]}
        onChange={(e) => setVals((v) => ({ ...v, [key]: e.target.value }))}
        dir="rtl"
        className={`${inputCls} mt-1.5`}
      />
    </div>
  );

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[14px] font-[1000] text-[var(--text)]">{dict.title}</h3>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {loading ? (
        <p className="mt-4 text-[13px] font-[850] text-[var(--muted)]">...</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {field(KEYS.phone, dict.phone, "+98 21 9100 5599")}
            {field(KEYS.email, dict.email, "info@figureforge.ir")}
          </div>

          <p className="mt-5 text-[13px] font-[950] text-[var(--text)]">{dict.address}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {localeField(KEYS.addressFa, dict.fa)}
            {localeField(KEYS.addressEn, dict.en)}
            {localeField(KEYS.addressAr, dict.ar)}
          </div>

          <p className="mt-5 text-[13px] font-[950] text-[var(--text)]">{dict.hours}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {localeField(KEYS.hoursFa, dict.fa)}
            {localeField(KEYS.hoursEn, dict.en)}
            {localeField(KEYS.hoursAr, dict.ar)}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {busy ? "..." : dict.save}
            </button>
          </div>
        </>
      )}

      {msg && (
        <p
          className={`mt-3 text-[12.5px] font-[850] ${
            msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
