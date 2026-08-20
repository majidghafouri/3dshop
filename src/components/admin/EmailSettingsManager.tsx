"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EmailSettingsDict = {
  title: string;
  subtitle: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: string;
  from: string;
  save: string;
  saved: string;
  error: string;
  note: string;
};

const KEYS = {
  host: "smtp_host",
  port: "smtp_port",
  user: "smtp_user",
  pass: "smtp_pass",
  secure: "smtp_secure",
  from: "mail_from",
} as const;

export default function EmailSettingsManager({ dict }: { dict: EmailSettingsDict }) {
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>({
    [KEYS.host]: "",
    [KEYS.port]: "",
    [KEYS.user]: "",
    [KEYS.pass]: "",
    [KEYS.secure]: "false",
    [KEYS.from]: "",
  });
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
          const rows: { key: string; value: string; isSecret: boolean }[] = json.data.settings ?? [];
          const next = { ...vals };
          for (const k of Object.values(KEYS)) {
            const row = rows.find((r) => r.key === k);
            if (row) next[k] = row.isSecret ? "" : row.value;
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
            group: "email",
            isSecret: key === KEYS.pass,
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

  const field = (key: string, label: string, placeholder: string, type = "text") => (
    <label className="block">
      <span className="text-[12px] font-[900] text-[var(--text-2)]">{label}</span>
      <input
        type={type}
        value={vals[key]}
        onChange={(e) => setVals((v) => ({ ...v, [key]: e.target.value }))}
        placeholder={placeholder}
        dir="ltr"
        className={`${inputCls} mt-1.5`}
      />
    </label>
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
            {field(KEYS.host, dict.host, "smtp.example.com")}
            {field(KEYS.port, dict.port, "587")}
            {field(KEYS.user, dict.user, "user@example.com")}
            {field(KEYS.pass, dict.pass, "••••••••", "password")}
            {field(KEYS.from, dict.from, "noreply@example.com")}
            <label className="block">
              <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.secure}</span>
              <div className="mt-2.5 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={vals[KEYS.secure] === "true"}
                  onChange={(e) => setVals((v) => ({ ...v, [KEYS.secure]: e.target.checked ? "true" : "false" }))}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span className="text-[12.5px] font-[850] text-[var(--muted)]">SSL/TLS (port 465)</span>
              </div>
            </label>
          </div>

          <p className="mt-3 text-[11.5px] font-[800] text-[var(--muted)] leading-relaxed">{dict.note}</p>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
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
