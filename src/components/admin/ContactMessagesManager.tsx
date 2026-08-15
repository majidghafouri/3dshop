"use client";

import { useCallback, useEffect, useState } from "react";

type ContactMessagesDict = {
  title: string;
  subtitle: string;
  empty: string;
  from: string;
  subject: string;
  message: string;
  unread: string;
  markRead: string;
  delete: string;
  deleted: string;
  error: string;
};

type MsgRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ContactMessagesManager({ dict }: { dict: ContactMessagesDict }) {
  const [rows, setRows] = useState<MsgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contact-messages?take=100", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setRows(json.data.messages ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: string) => {
    setBusy(true);
    const res = await fetch("/api/admin/contact-messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: true }),
    });
    setBusy(false);
    const json = await res.json();
    if (json.ok) {
      setRows((r) => r.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } else {
      showMsg("err", dict.error);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    const res = await fetch(`/api/admin/contact-messages?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    const json = await res.json();
    if (json.ok) {
      setRows((r) => r.filter((m) => m.id !== id));
      showMsg("ok", dict.deleted);
    } else {
      showMsg("err", dict.error);
    }
  };

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[14px] font-[1000] text-[var(--text)]">{dict.title}</h3>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {loading ? (
        <p className="mt-4 text-[13px] font-[850] text-[var(--muted)]">...</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-[13px] font-[850] text-[var(--muted)]">{dict.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((m) => (
            <li
              key={m.id}
              className={`rounded-[14px] border p-4 ${
                m.isRead ? "border-[var(--line)]" : "border-[var(--primary)]/40 bg-[var(--primary)]/5"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] font-[950] text-[var(--text)] truncate">{m.name}</span>
                  <a
                    href={`mailto:${m.email}`}
                    dir="ltr"
                    className="text-[12px] font-[850] text-[var(--muted)] hover:text-[var(--primary)]"
                  >
                    {m.email}
                  </a>
                  {!m.isRead && (
                    <span className="text-[10px] font-[950] text-white bg-[var(--primary)] rounded-full px-2 py-0.5">
                      {dict.unread}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-[850] text-[var(--muted)]" dir="ltr">
                  {new Date(m.createdAt).toLocaleString("en-US")}
                </span>
              </div>
              {m.subject && (
                <p className="mt-2 text-[12.5px] font-[950] text-[var(--text-3)]">{dict.subject}: {m.subject}</p>
              )}
              <p className="mt-1.5 text-[13px] font-[800] text-[var(--text-2)] leading-relaxed whitespace-pre-wrap">
                {m.message}
              </p>
              <div className="mt-3 flex items-center gap-4">
                {!m.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(m.id)}
                    disabled={busy}
                    className="text-[12px] font-[950] text-[var(--primary)] hover:underline"
                  >
                    {dict.markRead}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  disabled={busy}
                  className="text-[12px] font-[950] text-[var(--danger)] hover:underline"
                >
                  {dict.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
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
