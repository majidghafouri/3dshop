"use client";

import { useRef, useState } from "react";

export default function SingleImageUploader({
  value,
  onChange,
  label,
  uploadingLabel,
  removeLabel,
  size = "normal",
  kind = "img",
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  uploadingLabel?: string;
  removeLabel?: string;
  size?: "normal" | "small";
  kind?: "img" | "cursor";
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
    form.append("kind", kind);
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

  const boxCls = size === "small"
    ? "w-20 h-20 rounded-[12px]"
    : "w-full aspect-[4/3] rounded-[14px]";

  return (
    <div>
      {value ? (
        <div className={`relative ${boxCls} overflow-hidden border border-[var(--line-2)] bg-[var(--surface-2)]`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            title={removeLabel}
            aria-label={removeLabel}
            className="absolute bottom-1 left-1 grid place-items-center w-5 h-5 rounded-full bg-black/55 text-white hover:bg-[var(--danger)] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${boxCls} border-2 border-dashed border-[var(--line-2)] text-[var(--muted-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors grid place-items-center text-[11px] font-[950] text-center leading-snug px-1`}
        >
          {uploading ? uploadingLabel ?? "..." : `+ ${label}`}
        </button>
      )}
      {error && <p className="mt-1 text-[11px] font-[850] text-[var(--danger)]">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
    </div>
  );
}
