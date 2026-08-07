"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOCALES = ["fa", "en", "ar"] as const;

export type AdminCategory = {
  slug: string;
  name?: string;
};

type CategoryManagerDict = {
  title: string;
  slug: string;
  name: string;
  add: string;
  delete: string;
  deleteConfirm: string;
  products: string;
  error: string;
};

type CategoryManagerProps = {
  categories: { id: string; slug: string; name: string; productCount: number }[];
  dict: CategoryManagerDict;
};

export default function CategoryManager({ categories, dict }: CategoryManagerProps) {
  const router = useRouter();
  const [form, setForm] = useState({ slug: "", fa: "", en: "", ar: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
        name: { fa: form.fa, en: form.en, ar: form.ar },
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      setForm({ slug: "", fa: "", en: "", ar: "" });
      router.refresh();
    } else {
      setMsg(`${dict.error}: ${json.error ?? "unknown"}`);
    }
  };

  const del = async (id: string) => {
    if (!confirm(dict.deleteConfirm)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) router.refresh();
  };

  return (
    <div>
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.title} ({categories.length})</h2>

      <form onSubmit={create} className="mt-4 bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
        <label className="lg:col-span-2 block">
          <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.slug}</span>
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="anime-figure"
            className="mt-1 w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[850] outline-none focus:border-[var(--primary)]"
          />
        </label>
        {LOCALES.map((l) => (
          <label key={l} className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.name} ({l})</span>
            <input
              value={form[l]}
              onChange={(e) => setForm((f) => ({ ...f, [l]: e.target.value }))}
              className="mt-1 w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[850] outline-none focus:border-[var(--primary)]"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={busy || !form.slug || !form.fa}
          className="rounded-[12px] text-white font-[950] px-4 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {busy ? "..." : `+ ${dict.add}`}
        </button>
      </form>
      {msg && <p className="mt-2 text-[12.5px] font-[850] text-[var(--danger)]">{msg}</p>}

      <div className="mt-4 space-y-2.5">
        {categories.map((c) => (
          <div key={c.id} className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-[950] text-[var(--text)]">{c.name}</p>
              <p className="text-[11.5px] font-[850] text-[var(--muted)]" dir="ltr">{c.slug} · {c.productCount} {dict.products}</p>
            </div>
            <button type="button" onClick={() => del(c.id)} className="text-[12px] font-[950] text-[var(--danger)] hover:underline">
              {dict.delete}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
