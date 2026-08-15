"use client";

import { useState } from "react";
import { Dictionary } from "@/lib/i18n-dictionaries";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.message.trim() || !form.email.trim()) {
      setError(dict.contact.form.error);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setSent(true);
      } else {
        setError(dict.contact.form.error);
      }
    } catch {
      setError(dict.contact.form.error);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-[var(--success-soft)] border border-[var(--success-soft-3)] rounded-[18px] p-6 text-center">
        <div className="text-[30px]">✅</div>
        <p className="mt-2 text-[14px] font-[950] text-[var(--success)]">{dict.contact.form.sent}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.06)]"
    >
      <h3 className="text-[17px] font-[1000] text-[var(--text)]">{dict.contact.form.title}</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <input value={form.name} onChange={set("name")} placeholder={dict.contact.form.name}
          className="border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14px] font-[850] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
        <input value={form.email} onChange={set("email")} placeholder={dict.contact.form.email} dir="ltr"
          className="border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14px] font-[850] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
        <input value={form.subject} onChange={set("subject")} placeholder={dict.contact.form.subject}
          className="sm:col-span-2 border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14px] font-[850] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
        <textarea value={form.message} onChange={set("message")} placeholder={dict.contact.form.message} rows={4}
          className="sm:col-span-2 border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14px] font-[850] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all resize-none" />
      </div>
      {error && (
        <p className="mt-3 text-[12.5px] font-[850] text-[var(--danger)]">{error}</p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="mt-4 rounded-[16px] text-white font-[950] px-7 py-3.5 text-[14px] shadow-[0_14px_34px_rgba(var(--primary-rgb),0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {sending ? dict.contact.form.sending : dict.contact.form.submit}
      </button>
    </form>
  );
}
