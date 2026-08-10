"use client";

import { useRef, useState } from "react";
import type { ProductFormDict } from "@/components/admin/ProductForm";

export default function AudioUploader({
  value,
  onChange,
  dict,
}: {
  value: string;
  onChange: (url: string) => void;
  dict: ProductFormDict;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok) onChange(json.data.urls[0]);
      else setError(json.error);
    } catch {
      setError("network");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-2">
      {value ? (
        <div className="flex items-center gap-2 rounded-[12px] border border-[var(--line-2)] bg-[var(--surface-2)] px-2.5 py-1.5">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={value} className="h-9 flex-1 min-w-0" preload="none" />
          <button
            type="button"
            onClick={() => onChange("")}
            title={dict.musicRemove}
            aria-label={dict.musicRemove}
            className="shrink-0 grid place-items-center w-8 h-8 rounded-full text-[var(--muted-2)] hover:text-[var(--danger)] hover:bg-[var(--danger-softer)] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-[12px] border-2 border-dashed border-[var(--line-2)] text-[var(--muted-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors py-2.5 text-[12.5px] font-[950]"
        >
          {uploading ? dict.musicUploading : `+ ${dict.musicUpload}`}
        </button>
      )}

      {error && (
        <p className="mt-2 text-[12px] font-[850] text-[var(--danger)]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
