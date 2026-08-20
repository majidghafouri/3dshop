"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CouponDict = {
  title: string;
  subtitle: string;
  new: string;
  code: string;
  type: string;
  percentage: string;
  fixedAmount: string;
  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  active: string;
  actions: string;
  edit: string;
  delete: string;
  deleteConfirm: string;
  save: string;
  cancel: string;
  saving: string;
  created: string;
  updated: string;
  error: string;
  codeExists: string;
  invalidType: string;
  invalidPercentage: string;
  fillRequired: string;
  usage: string;
  of: string;
  unlimited: string;
  expired: string;
  activeLabel: string;
  inactiveLabel: string;
  startsAt: string;
  endsAt: string;
};

type Coupon = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
};

const inputCls =
  "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

export default function CouponManager({ coupons, dict }: { coupons: Coupon[]; dict: CouponDict }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const emptyForm = {
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    value: 10,
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    validFrom: new Date().toISOString().slice(0, 16),
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
    isActive: true,
  };
  const [form, setForm] = useState(emptyForm);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const startEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrderAmount: c.minOrderAmount?.toString() ?? "",
      maxDiscountAmount: c.maxDiscountAmount?.toString() ?? "",
      usageLimit: c.usageLimit?.toString() ?? "",
      validFrom: new Date(c.validFrom).toISOString().slice(0, 16),
      validUntil: new Date(c.validUntil).toISOString().slice(0, 16),
      isActive: c.isActive,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        code: form.code,
        type: form.type,
        value: form.value,
        minOrderAmount: form.minOrderAmount ? parseInt(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? parseInt(form.maxDiscountAmount) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        validFrom: form.validFrom,
        validUntil: form.validUntil,
        isActive: form.isActive,
      };
      const res = await fetch("/api/admin/coupons", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        showMsg("ok", editing ? dict.updated : dict.created);
        cancelEdit();
        router.refresh();
      } else {
        let errMsg = dict.error;
        if (json.error === "code_exists") errMsg = dict.codeExists;
        else if (json.error === "invalid_type") errMsg = dict.invalidType;
        else if (json.error === "invalid_percentage") errMsg = dict.invalidPercentage;
        else if (json.error === "fill_required") errMsg = dict.fillRequired;
        showMsg("err", errMsg);
      }
    } catch {
      showMsg("err", dict.error);
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm(dict.deleteConfirm)) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) router.refresh();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-CA");

  const isExpired = (c: Coupon) => new Date(c.validUntil) < new Date();

  return (
    <div>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      <form onSubmit={submit} className="mt-4 bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.code}</span>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.type}</span>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT" }))}
              className={`${inputCls} mt-1 appearance-none cursor-pointer`}
            >
              <option value="PERCENTAGE">{dict.percentage}</option>
              <option value="FIXED_AMOUNT">{dict.fixedAmount}</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.value}</span>
            <input
              type="number"
              min={form.type === "PERCENTAGE" ? 1 : 0}
              max={form.type === "PERCENTAGE" ? 100 : undefined}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: parseInt(e.target.value) || 0 }))}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.usageLimit}</span>
            <input
              type="number"
              min={1}
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              placeholder={dict.unlimited}
              className={`${inputCls} mt-1`}
            />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.minOrder}</span>
            <input
              type="number"
              min={0}
              value={form.minOrderAmount}
              onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.maxDiscount}</span>
            <input
              type="number"
              min={0}
              value={form.maxDiscountAmount}
              onChange={(e) => setForm((f) => ({ ...f, maxDiscountAmount: e.target.value }))}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.validFrom}</span>
            <input
              type="datetime-local"
              value={form.validFrom}
              onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.validUntil}</span>
            <input
              type="datetime-local"
              value={form.validUntil}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
              className={`${inputCls} mt-1`}
            />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded accent-[var(--primary)]"
            />
            <span className="text-[13px] font-[900] text-[var(--text)]">{dict.active}</span>
          </label>
          <div className="flex-1" />
          {editing && (
            <button type="button" onClick={cancelEdit} className="text-[13px] font-[900] text-[var(--muted)] hover:text-[var(--text)]">
              {dict.cancel}
            </button>
          )}
          <button
            type="submit"
            disabled={busy || !form.code || !form.value}
            className="rounded-[12px] text-white font-[950] px-5 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
            style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
          >
            {busy ? dict.saving : editing ? dict.save : `+ ${dict.new}`}
          </button>
        </div>
      </form>

      {msg && (
        <p className={`mt-3 text-[12.5px] font-[850] ${msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {msg.text}
        </p>
      )}

      <div className="mt-4 space-y-2.5">
        {coupons.map((c) => {
          const expired = isExpired(c);
          return (
            <div key={c.id} className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-[1000] text-[var(--text)]" dir="ltr">{c.code}</span>
                  <span className="text-[11px] font-[850] px-2 py-0.5 rounded-full bg-[var(--bg-tint)] text-[var(--text-2)]">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : `${c.value.toLocaleString("en-US")}`}
                  </span>
                  {c.type === "PERCENTAGE" && c.maxDiscountAmount && (
                    <span className="text-[10.5px] font-[800] text-[var(--muted)]">
                      (max {c.maxDiscountAmount.toLocaleString("en-US")})
                    </span>
                  )}
                  <span className={`text-[11px] font-[850] px-2 py-0.5 rounded-full ${
                    expired
                      ? "bg-[var(--danger-softer)] text-[var(--danger)]"
                      : c.isActive
                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--bg-tint)] text-[var(--muted)]"
                  }`}>
                    {expired ? dict.expired : c.isActive ? dict.activeLabel : dict.inactiveLabel}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] font-[800] text-[var(--muted)]">
                  {c.minOrderAmount && <span>{dict.minOrder}: {c.minOrderAmount.toLocaleString("en-US")}</span>}
                  <span>{dict.usage}: {c.usedCount} {dict.of} {c.usageLimit ?? "∞"}</span>
                  <span>{dict.startsAt}: {formatDate(c.validFrom)}</span>
                  <span>{dict.endsAt}: {formatDate(c.validUntil)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => startEdit(c)} className="text-[12px] font-[950] text-[var(--primary)] hover:underline">
                  {dict.edit}
                </button>
                <button type="button" onClick={() => del(c.id)} className="text-[12px] font-[950] text-[var(--danger)] hover:underline">
                  {dict.delete}
                </button>
              </div>
            </div>
          );
        })}
        {coupons.length === 0 && (
          <p className="text-center text-[13px] font-[850] text-[var(--muted)] py-8">{dict.title}</p>
        )}
      </div>
    </div>
  );
}
