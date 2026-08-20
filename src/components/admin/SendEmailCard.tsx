"use client";

import { useState } from "react";

type SendEmailDict = {
  title: string;
  subtitle: string;
  to: string;
  toPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  body: string;
  bodyPlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  failed: string;
};

export default function SendEmailCard({ dict }: { dict: SendEmailDict }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const send = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim() || undefined,
          subject: subject.trim() || undefined,
          body: body.trim(),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        showMsg("ok", `${dict.sent} ${json.to}`);
        setBody("");
      } else {
        showMsg("err", `${dict.failed}: ${json.error ?? json.detail ?? "unknown"}`);
      }
    } catch {
      showMsg("err", dict.failed);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[14px] font-[1000] text-[var(--text)]">{dict.title}</h3>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <label className="block">
          <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.to}</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder={dict.toPlaceholder}
            dir="ltr"
            className={`${inputCls} mt-1.5`}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.subject}</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={dict.subjectPlaceholder}
            className={`${inputCls} mt-1.5`}
          />
        </label>
      </div>

      <label className="block mt-3.5">
        <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.body}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={dict.bodyPlaceholder}
          rows={6}
          className={`${inputCls} mt-1.5 resize-y`}
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={send}
          disabled={busy || !body.trim()}
          className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {busy ? dict.sending : dict.send}
        </button>
      </div>

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
