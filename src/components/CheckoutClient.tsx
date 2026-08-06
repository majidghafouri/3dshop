"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dictionary } from "@/lib/i18n-dictionaries";
import { useCart } from "@/components/CartProvider";

export default function CheckoutClient({
  dict,
  prefix,
  isAuthed,
  userPhone,
}: {
  dict: Dictionary;
  prefix: string;
  isAuthed: boolean;
  userPhone?: string;
}) {
  const router = useRouter();
  const { items, subtotal, loading } = useCart();
  const [form, setForm] = useState({
    fullName: "",
    phone: userPhone ?? "",
    address: "",
    postalCode: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("GATEWAY_PLACEHOLDER");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderNumber: number } | null>(null);

  const savings = items.reduce((s, i) => {
    if (i.product.compareAtPrice && i.product.compareAtPrice > i.product.price) {
      return s + (i.product.compareAtPrice - i.product.price) * i.quantity;
    }
    return s;
  }, 0);
  const total = subtotal;

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-[560px] bg-[var(--surface)] border border-[var(--line)] rounded-[28px] p-14 text-center shadow-[0_18px_54px_rgba(20,45,90,0.10)]">
        <div className="text-[52px]">🔐</div>
        <h1 className="mt-4 text-[22px] font-[1000] text-[var(--text)]">{dict.checkout.needLogin}</h1>
        <p className="mt-2 text-[14px] font-[750] text-[var(--muted)]">{dict.checkout.pleaseLogin}</p>
        <Link
          href={`${prefix}/auth?next=${encodeURIComponent(`${prefix}/checkout`)}`}
          className="inline-flex mt-6 rounded-[16px] text-white font-[950] px-8 py-4 text-[15px] shadow-[0_14px_34px_rgba(52,84,209,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {dict.checkout.loginNow}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-[560px] bg-[var(--surface)] border border-[var(--line)] rounded-[28px] p-14 text-center shadow-[0_18px_54px_rgba(20,45,90,0.10)]">
        <div className="mx-auto w-[72px] h-[72px] rounded-full bg-[var(--success-soft)] flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--teal-2)" strokeWidth="2.6"><path d="m4.5 12.5 5 5 10-11"/></svg>
        </div>
        <h1 className="mt-5 text-[22px] font-[1000] text-[var(--text)]">{dict.checkout.orderCreated}</h1>
        <p className="mt-2 text-[14px] font-[750] text-[var(--muted)]">{dict.checkout.orderCreatedDesc}</p>
        <p className="mt-4 text-[13.5px] font-[950] text-[var(--primary)]" dir="ltr">
          #{done.orderNumber}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href={`${prefix}/account`}
            className="rounded-[16px] text-white font-[950] px-6 py-3.5 text-[14px] shadow-[0_14px_34px_rgba(52,84,209,0.25)] transition-all duration-300"
            style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
          >
            {dict.checkout.toAccount}
          </Link>
          <Link
            href={`${prefix}/products`}
            className="rounded-[16px] font-[950] px-6 py-3.5 text-[14px] border border-[var(--line-2)] bg-[var(--surface)] text-[var(--primary)] transition-all duration-300"
          >
            {dict.products.viewAll}
          </Link>
        </div>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError(dict.checkout.fillRequired);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error === "empty_cart" ? dict.cart.empty : dict.checkout.fillRequired);
        return;
      }
      setDone({ orderNumber: json.data.order.orderNumber });
      router.refresh();
    } catch {
      setError(dict.checkout.fillRequired);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-[20px] items-start">
      <form onSubmit={submit} className="bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.06)]">
        <h1 className="text-[clamp(20px,2.4vw,26px)] font-[1000] text-[var(--text)]">{dict.checkout.title}</h1>

        {/* shipping info */}
        <h2 className="mt-6 text-[15px] font-[1000] text-[var(--primary)]">{dict.checkout.shippingInfo}</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <label className="block">
            <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.checkout.fullName} *</span>
            <input value={form.fullName} onChange={set("fullName")} className="mt-1.5 w-full border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14.5px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.checkout.phone} *</span>
            <input value={form.phone} onChange={set("phone")} dir="ltr" className="mt-1.5 w-full border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14.5px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.checkout.address} *</span>
            <textarea value={form.address} onChange={set("address")} rows={2} className="mt-1.5 w-full border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14.5px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all resize-none" />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.checkout.postalCode}</span>
            <input value={form.postalCode} onChange={set("postalCode")} dir="ltr" className="mt-1.5 w-full border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14.5px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.checkout.note}</span>
            <input value={form.note} onChange={set("note")} className="mt-1.5 w-full border border-[var(--line-2)] rounded-[14px] px-4 py-3 text-[14.5px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
          </label>
        </div>

        {/* payment method */}
        <h2 className="mt-7 text-[15px] font-[1000] text-[var(--primary)]">{dict.checkout.paymentMethod}</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "GATEWAY_PLACEHOLDER",
              title: dict.checkout.paymentOnline,
              desc: dict.checkout.paymentOnlineDesc,
              icon: "💳",
            },
            {
              id: "CASH_ON_DELIVERY",
              title: dict.checkout.paymentCash,
              desc: dict.checkout.paymentCashDesc,
              icon: "💵",
            },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`text-right rounded-[16px] border-2 p-4 transition-all duration-200 ${
                paymentMethod === m.id
                  ? "border-[var(--primary)] bg-[var(--bg-tint)]"
                  : "border-[var(--soft-line)] bg-[var(--surface)] hover:border-[var(--line-8)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[22px]">{m.icon}</span>
                <div>
                  <p className="text-[14px] font-[1000] text-[var(--text)]">{m.title}</p>
                  <p className="mt-0.5 text-[11.5px] font-[800] text-[var(--muted)]">{m.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] font-[850] text-[var(--muted)]">⚠️ {dict.checkout.paymentPlaceholder}</p>

        {error && (
          <p className="mt-4 text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || loading || items.length === 0}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-[16px] text-white font-[950] py-4 text-[15px] shadow-[0_14px_34px_rgba(52,84,209,0.25)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {busy ? dict.common.loading : dict.checkout.placeOrder}
        </button>
      </form>

      {/* summary */}
      <div className="lg:sticky lg:top-[96px] bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.06)]">
        <h2 className="text-[17px] font-[1000] text-[var(--text)]">{dict.checkout.orderSummary}</h2>
        <div className="mt-4 space-y-3.5 max-h-[320px] overflow-auto no-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-[12px] overflow-hidden border border-[var(--soft-line)] product-img-bg shrink-0">
                {item.product.images[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[950] text-[var(--text)] line-clamp-1">{item.product.name}</p>
                <p className="text-[11.5px] font-[850] text-[var(--muted)]">× {item.quantity}</p>
              </div>
              <span className="text-[13px] font-[950] text-[var(--text)]" dir="ltr">
                {(item.product.price * item.quantity).toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--surface-3)] space-y-2.5 text-[13.5px] font-[850]">
          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>{dict.cart.subtotal}</span>
            <span dir="ltr">{subtotal.toLocaleString("en-US")} {dict.common.currency}</span>
          </div>
          {savings > 0 && (
            <div className="flex items-center justify-between text-[var(--teal-2)]">
              <span>{dict.cart.discount}</span>
              <span dir="ltr">− {savings.toLocaleString("en-US")} {dict.common.currency}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>{dict.cart.shipping}</span>
            <span className="text-[var(--teal-2)] font-[950]">{dict.cart.shippingFree}</span>
          </div>
        </div>
        <div className="mt-3 pt-4 border-t border-[var(--surface-3)] flex items-center justify-between">
          <span className="text-[14px] font-[1000] text-[var(--text)]">{dict.cart.total}</span>
          <span className="text-[20px] font-[1000] text-[var(--primary)]" dir="ltr">
            {total.toLocaleString("en-US")} {dict.common.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
