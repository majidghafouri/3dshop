"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOCALES = ["fa", "en", "ar"] as const;

type ProductData = {
  slug: string;
  sku?: string;
  brand?: string;
  price: string;
  compareAtPrice?: string;
  stock: string;
  isActive: boolean;
  isFeatured: boolean;
  isSpecial: boolean;
  heightCm?: string;
  material?: string;
  weightGrams?: string;
  images: string;
  musicUrl?: string;
  musicTitle?: string;
  categorySlug?: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  description: Record<string, string>;
};

type CategoryOption = { slug: string; name: string };

type ProductFormDict = {
  basics: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  priceToman: string;
  compareAt: string;
  stock: string;
  height: string;
  material: string;
  weight: string;
  activeLabel: string;
  featured: string;
  special: string;
  images: string;
  music: string;
  musicUrl: string;
  musicTitle: string;
  translations: string;
  name: string;
  shortDesc: string;
  description: string;
  none: string;
  create: string;
  saveChanges: string;
  saving: string;
  error: string;
  unknown: string;
  required: string;
};

export default function ProductForm({
  categories,
  initial,
  isEdit,
  dict,
  redirectHref,
}: {
  categories: CategoryOption[];
  initial?: ProductData & { id?: string };
  isEdit?: boolean;
  dict: ProductFormDict;
  redirectHref: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductData>(
    initial ?? {
      slug: "",
      sku: "",
      brand: "",
      price: "",
      compareAtPrice: "",
      stock: "10",
      isActive: true,
      isFeatured: false,
      isSpecial: false,
      heightCm: "",
      material: "",
      weightGrams: "",
      images: "",
      musicUrl: "",
      musicTitle: "",
      categorySlug: "",
      name: { fa: "", en: "", ar: "" },
      shortDescription: { fa: "", en: "", ar: "" },
      description: { fa: "", en: "", ar: "" },
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof ProductData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setLoc = (k: "name" | "shortDescription" | "description", loc: string, v: string) =>
    setForm((f) => ({ ...f, [k]: { ...f[k], [loc]: v } }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.slug.trim() || !form.name.fa.trim()) {
      setError(dict.required);
      return;
    }
    setBusy(true);

    const payload = {
      slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      sku: form.sku?.trim() || undefined,
      brand: form.brand?.trim() || undefined,
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock) || 0,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isSpecial: form.isSpecial,
      heightCm: form.heightCm?.trim() || undefined,
      material: form.material?.trim() || undefined,
      weightGrams: form.weightGrams ? Number(form.weightGrams) : undefined,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      musicUrl: form.musicUrl?.trim() || undefined,
      musicTitle: form.musicTitle?.trim() || undefined,
      categorySlug: form.categorySlug || undefined,
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${initial?.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      router.push(redirectHref);
      router.refresh();
    } else {
      setError(`${dict.error}: ${json.error ?? dict.unknown}`);
    }
  };

  const inputCls =
    "mt-1 w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5">
        <h3 className="text-[15px] font-[1000] text-[var(--text)]">{dict.basics}</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.slug} *</span>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="naruto-uzumaki" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.sku}</span>
            <input value={form.sku ?? ""} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.brand}</span>
            <input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} placeholder="Figuarts" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.category}</span>
            <select value={form.categorySlug ?? ""} onChange={(e) => set("categorySlug", e.target.value)} className={inputCls}>
              <option value="">{dict.none}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.priceToman} *</span>
            <input value={form.price} onChange={(e) => set("price", e.target.value)} type="number" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.compareAt}</span>
            <input value={form.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", e.target.value)} type="number" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.stock}</span>
            <input value={form.stock} onChange={(e) => set("stock", e.target.value)} type="number" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.height}</span>
            <input value={form.heightCm ?? ""} onChange={(e) => set("heightCm", e.target.value)} placeholder="30 cm" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.material}</span>
            <input value={form.material ?? ""} onChange={(e) => set("material", e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.weight}</span>
            <input value={form.weightGrams ?? ""} onChange={(e) => set("weightGrams", e.target.value)} type="number" className={inputCls} />
          </label>
        </div>
        <div className="mt-3.5 flex gap-4">
          {[
            { k: "isActive" as const, label: dict.activeLabel },
            { k: "isFeatured" as const, label: dict.featured },
            { k: "isSpecial" as const, label: dict.special },
          ].map(({ k, label }) => (
            <label key={k} className="flex items-center gap-2 text-[13px] font-[900] text-[var(--text-3)] cursor-pointer">
              <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} className="w-4 h-4 accent-[var(--primary)]" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5">
        <h3 className="text-[15px] font-[1000] text-[var(--text)]">{dict.images}</h3>
        <textarea
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          rows={3}
          placeholder={"https://.../main.jpg\nhttps://.../detail.jpg"}
          className={inputCls}
        />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5">
        <h3 className="text-[15px] font-[1000] text-[var(--text)]">{dict.music}</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.musicUrl}</span>
            <input value={form.musicUrl ?? ""} onChange={(e) => set("musicUrl", e.target.value)} placeholder="/music/baby-yoda-grogu.mp3" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.musicTitle}</span>
            <input value={form.musicTitle ?? ""} onChange={(e) => set("musicTitle", e.target.value)} placeholder="Enchanted Valley" className={inputCls} />
          </label>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-5">
        <h3 className="text-[15px] font-[1000] text-[var(--text)]">{dict.translations}</h3>
        <div className="mt-3 space-y-4">
          {LOCALES.map((l) => (
            <div key={l} className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 bg-[var(--surface-2)] border border-[var(--soft-line)] rounded-[14px]">
              <label className="block">
                <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.name} ({l})</span>
                <input value={form.name[l]} onChange={(e) => setLoc("name", l, e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.shortDesc} ({l})</span>
                <input value={form.shortDescription[l]} onChange={(e) => setLoc("shortDescription", l, e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.description} ({l})</span>
                <textarea value={form.description[l]} onChange={(e) => setLoc("description", l, e.target.value)} rows={2} className={inputCls} />
              </label>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-[14px] text-white font-[950] px-6 py-3.5 text-[14px] shadow-[0_12px_30px_rgba(52,84,209,0.25)] disabled:opacity-50 hover:-translate-y-0.5 transition-all"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {busy ? dict.saving : isEdit ? dict.saveChanges : dict.create}
      </button>
    </form>
  );
}
