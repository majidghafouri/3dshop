"use client";

import { useRef, useState } from "react";
import type { ProductFormDict } from "@/components/admin/ProductForm";

export default function ImageUploader({
  value,
  onChange,
  dict,
}: {
  value: string[];
  onChange: (images: string[]) => void;
  dict: ProductFormDict;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok) onChange([...value, ...json.data.urls]);
      else setError(json.error);
    } catch {
      setError("network");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };

  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-[4/3] rounded-[14px] overflow-hidden border border-[var(--line-2)] bg-[var(--surface-2)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title={dict.imageMoveUp}
                aria-label={dict.imageMoveUp}
                className="grid place-items-center w-6 h-6 rounded-full bg-black/55 text-white opacity-90 hover:opacity-100 disabled:opacity-30 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                title={dict.imageMoveDown}
                aria-label={dict.imageMoveDown}
                className="grid place-items-center w-6 h-6 rounded-full bg-black/55 text-white opacity-90 hover:opacity-100 disabled:opacity-30 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              title={dict.imageRemove}
              aria-label={dict.imageRemove}
              className="absolute bottom-1.5 left-1.5 grid place-items-center w-6 h-6 rounded-full bg-black/55 text-white hover:bg-[var(--danger)] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-[4/3] rounded-[14px] border-2 border-dashed border-[var(--line-2)] text-[var(--muted-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors grid place-items-center text-[12.5px] font-[950] text-center leading-snug px-2"
        >
          {uploading ? dict.imageUploading : `+ ${dict.imageUpload}`}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[12px] font-[850] text-[var(--danger)]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />
    </div>
  );
}
