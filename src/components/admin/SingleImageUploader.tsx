"use client";

import { useRef, useState } from "react";

export default function SingleImageUploader({
  value,
  onChange,
  label,
  uploadingLabel,
  removeLabel,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  uploadingLabel?: string;
  removeLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("files", files[0]);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok && json.data?.urls?.[0]) onChange(json.data.urls[0]);
      else setError(json.error ?? "upload failed");
    } catch {
      setError("network");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden border border-[var(--line-2)] bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            title={removeLabel}
            aria-label={removeLabel}
            className="absolute bottom-1.5 left-1.5 grid place-items-center w-6 h-6 rounded-full bg-black/55 text-white hover:bg-[var(--danger)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[4/3] rounded-[14px] border-2 border-dashed border-[var(--line-2)] text-[var(--muted-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors grid place-items-center text-[12.5px] font-[950] text-center leading-snug px-2"
        >
          {uploading ? uploadingLabel ?? "..." : `+ ${label}`}
        </button>
      )}
      {error && <p className="mt-1 text-[11px] font-[850] text-[var(--danger)]">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
    </div>
  );
}
