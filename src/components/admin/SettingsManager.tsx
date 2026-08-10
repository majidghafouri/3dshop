"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SettingRow = {
  key: string;
  group: string | null;
  isSecret: boolean;
  value: string;
  updatedAt: string;
};

type SettingsDict = {
  title: string;
  subtitle: string;
  add: string;
  key: string;
  value: string;
  group: string;
  groupPlaceholder: string;
  secret: string;
  save: string;
  saved: string;
  error: string;
  empty: string;
  delete: string;
  edit: string;
  cancel: string;
  secretValue: string;
  updated: string;
};

const MASKED = "••••••••";

export default function SettingsManager({ dict }: { dict: SettingsDict }) {
  const router = useRouter();
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [form, setForm] = useState({
    key: "",
    group: "",
    value: "",
    isSecret: true,
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setRows(json.data.settings ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const save = async () => {
    const key = form.key.trim();
    if (!key || !form.value) {
      showMsg("err", dict.error);
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        group: form.group.trim() || undefined,
        value: form.value,
        isSecret: form.isSecret,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      setForm({ key: "", group: "", value: "", isSecret: true });
      showMsg("ok", dict.saved);
      await load();
      router.refresh();
    } else {
      showMsg("err", `${dict.error}: ${json.error ?? "unknown"}`);
    }
  };

  const updateValue = async (key: string) => {
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: editValue }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      setEditing(null);
      setEditValue("");
      showMsg("ok", dict.saved);
      await load();
      router.refresh();
    } else {
      showMsg("err", `${dict.error}: ${json.error ?? "unknown"}`);
    }
  };

  const remove = async (key: string) => {
    setBusy(true);
    const res = await fetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    setBusy(false);
    const json = await res.json();
    if (json.ok) {
      showMsg("ok", dict.saved);
      await load();
      router.refresh();
    } else {
      showMsg("err", dict.error);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  return (
    <div>
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.title}</h2>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {/* add form */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[13.5px] font-[1000] text-[var(--text)]">{dict.add}</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.key} *</span>
            <input
              value={form.key}
              onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
              placeholder="VANDAR_API_KEY"
              dir="ltr"
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.group}</span>
            <input
              value={form.group}
              onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
              placeholder={dict.groupPlaceholder}
              dir="ltr"
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.value} *</span>
            <input
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              dir="ltr"
              className={`${inputCls} mt-1.5`}
            />
          </label>
        </div>
        <div className="mt-3.5 flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isSecret}
              onChange={(e) => setForm((f) => ({ ...f, isSecret: e.target.checked }))}
              className="accent-[var(--primary)] w-4 h-4"
            />
            <span className="text-[13px] font-[850] text-[var(--text-3)]">{dict.secret}</span>
          </label>
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
        {msg && (
          <p className={`mt-3 text-[12.5px] font-[850] ${msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {msg.text}
          </p>
        )}
      </div>

      {/* list */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] overflow-hidden">
        {loading ? (
          <p className="p-5 text-[13px] font-[850] text-[var(--muted)]">...</p>
        ) : rows.length === 0 ? (
          <p className="p-5 text-[13px] font-[850] text-[var(--muted)]">{dict.empty}</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-right border-b border-[var(--surface-3)] text-[var(--muted)] font-[900]">
                <th className="px-4 py-3">{dict.key}</th>
                <th className="px-4 py-3">{dict.group}</th>
                <th className="px-4 py-3">{dict.value}</th>
                <th className="px-4 py-3">{dict.updated}</th>
                <th className="px-4 py-3">{dict.edit}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-3)]">
              {rows.map((r) => (
                <tr key={r.key} className="font-[850] text-[var(--text-3)]">
                  <td className="px-4 py-3 font-[950] text-[var(--primary)]" dir="ltr">
                    {r.key}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {r.group ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {editing === r.key ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          dir="ltr"
                          className="w-[220px] border border-[var(--line-2)] rounded-[10px] px-2.5 py-1.5 text-[12.5px] font-[800] outline-none focus:border-[var(--primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => updateValue(r.key)}
                          disabled={busy}
                          className="text-[12px] font-[950] text-[var(--success)] hover:underline"
                        >
                          {dict.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(null);
                            setEditValue("");
                          }}
                          className="text-[12px] font-[950] text-[var(--muted)] hover:underline"
                        >
                          {dict.cancel}
                        </button>
                      </div>
                    ) : (
                      <span dir="ltr" className="text-[var(--muted-3)]">
                        {r.isSecret ? MASKED : r.value}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]" dir="ltr">
                    {new Date(r.updatedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(r.key);
                          setEditValue(r.isSecret ? "" : r.value);
                        }}
                        className="text-[12px] font-[950] text-[var(--primary)] hover:underline"
                      >
                        {r.isSecret ? dict.secretValue : dict.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.key)}
                        disabled={busy}
                        className="text-[12px] font-[950] text-[var(--danger)] hover:underline"
                      >
                        {dict.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
