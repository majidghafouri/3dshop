"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Palette,
  PalettePreset,
  buildThemeStyle,
} from "@/lib/palette";

type AppearanceDict = {
  title: string;
  subtitle: string;
  presets: string;
  custom: string;
  light: string;
  dark: string;
  primary: string;
  sky: string;
  teal: string;
  apply: string;
  saved: string;
  error: string;
};

const MODES = ["light", "dark"] as const;
const COLORS = ["primary", "sky", "teal"] as const;

type ThemeEditorProps = {
  initial: Palette;
  presets: PalettePreset[];
  dict: AppearanceDict;
};

export default function ThemeEditor({ initial, presets, dict }: ThemeEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Palette>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const styleId = "figurize-palette-preview";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = buildThemeStyle(draft);
    return () => {
      el?.remove();
    };
  }, [draft]);

  const setColor = (mode: (typeof MODES)[number], key: (typeof COLORS)[number], value: string) => {
    setDraft((d) => ({
      ...d,
      [mode]: { ...d[mode], [key]: value },
    }));
  };

  const save = async () => {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palette: draft }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) {
      setMsg({ kind: "ok", text: dict.saved });
      router.refresh();
    } else {
      setMsg({ kind: "err", text: `${dict.error}: ${json.error ?? "unknown"}` });
    }
  };

  return (
    <div>
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.title}</h2>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      <div className="mt-5">
        <h3 className="text-[13px] font-[950] text-[var(--text-2)]">{dict.presets}</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((p) => {
            const active = ["primary", "sky", "teal"].every(
              (k) =>
                draft.light[k as keyof typeof draft.light] === p.palette.light[k as keyof typeof draft.light] &&
                draft.dark[k as keyof typeof draft.dark] === p.palette.dark[k as keyof typeof draft.dark],
            );
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setDraft(p.palette)}
                className={`rounded-[14px] border p-3 text-left transition-colors ${
                  active
                    ? "border-[var(--primary)] bg-[var(--soft)]"
                    : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)]"
                }`}
              >
                <span className="flex gap-1.5">
                  <span className="h-6 w-6 rounded-full ring-2 ring-white/20" style={{ background: p.palette.light.primary }} />
                  <span className="h-6 w-6 rounded-full ring-2 ring-white/20" style={{ background: p.palette.light.sky }} />
                  <span className="h-6 w-6 rounded-full ring-2 ring-white/20" style={{ background: p.palette.light.teal }} />
                </span>
                <span className="mt-2 block text-[12.5px] font-[950] text-[var(--text)]" dir="ltr">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-[13px] font-[950] text-[var(--text-2)]">{dict.custom}</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODES.map((mode) => (
            <div key={mode} className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-4">
              <p className="text-[12.5px] font-[950] text-[var(--text)]">
                {mode === "light" ? dict.light : dict.dark}
              </p>
              <div className="mt-3 space-y-2.5">
                {COLORS.map((key) => {
                  const label = key === "primary" ? dict.primary : key === "sky" ? dict.sky : dict.teal;
                  return (
                    <label key={key} className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-[900] text-[var(--text-2)]">{label}</span>
                      <span className="flex items-center gap-2">
                        <input
                          type="text"
                          value={draft[mode][key]}
                          onChange={(e) => setColor(mode, key, e.target.value)}
                          className="w-[84px] border border-[var(--line-2)] rounded-[10px] px-2 py-1.5 text-[12px] font-[850] outline-none focus:border-[var(--primary)]"
                          dir="ltr"
                        />
                        <input
                          type="color"
                          value={draft[mode][key]}
                          onChange={(e) => setColor(mode, key, e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded-[10px] border border-[var(--line-2)] bg-transparent p-0.5"
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {busy ? "..." : dict.apply}
        </button>
        {msg && (
          <span className={`text-[12.5px] font-[850] ${msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
