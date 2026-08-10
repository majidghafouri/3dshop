export type PaletteMode = {
  primary: string;
  sky: string;
  teal: string;
};

export type Palette = {
  light: PaletteMode;
  dark: PaletteMode;
};

export type PalettePreset = {
  id: string;
  name: string;
  palette: Palette;
};

export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(v: unknown): v is string {
  return typeof v === "string" && HEX_RE.test(v);
}

export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export const DEFAULT_PALETTE: Palette = {
  light: { primary: "#3454d1", sky: "#169ed9", teal: "#15c8b8" },
  dark: { primary: "#6b84f2", sky: "#3aa9e0", teal: "#2bd3c3" },
};

export const PRESETS: PalettePreset[] = [
  {
    id: "figureforge",
    name: "Figureforge",
    palette: DEFAULT_PALETTE,
  },
  {
    id: "emerald",
    name: "Emerald",
    palette: {
      light: { primary: "#0f9d58", sky: "#22c55e", teal: "#14b8a6" },
      dark: { primary: "#4ade80", sky: "#6ee7b7", teal: "#2dd4bf" },
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    palette: {
      light: { primary: "#0e7490", sky: "#06b6d4", teal: "#14b8a6" },
      dark: { primary: "#22d3ee", sky: "#67e8f9", teal: "#2dd4bf" },
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    palette: {
      light: { primary: "#ea580c", sky: "#f59e0b", teal: "#ef4444" },
      dark: { primary: "#fb923c", sky: "#fbbf24", teal: "#f87171" },
    },
  },
  {
    id: "violet",
    name: "Violet",
    palette: {
      light: { primary: "#7c3aed", sky: "#a855f7", teal: "#06b6d4" },
      dark: { primary: "#a78bfa", sky: "#c084fc", teal: "#22d3ee" },
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    palette: {
      light: { primary: "#dc2626", sky: "#ef4444", teal: "#f59e0b" },
      dark: { primary: "#f87171", sky: "#fca5a5", teal: "#fbbf24" },
    },
  },
];

type ModeBlock = { primary: string; sky: string; teal: string };

const mix = (color: string, withColor: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, ${withColor})`;

function buildMode(m: ModeBlock, dark: boolean): string {
  const p = m.primary;
  const s = m.sky;
  const t = m.teal;
  const surf = dark ? "#121c31" : "#ffffff";
  const bg = dark ? "#0a1120" : "#ffffff";
  const lines = dark
    ? { a: 24, b: 28, c: 30, d: 32, strong: 44, stronger: 34 }
    : { a: 17, b: 15, c: 19, d: 27, strong: 40, stronger: 30 };

  return [
    `  --primary: ${p};`,
    `  --primary-2: ${mix(p, dark ? "#ffffff" : "#000000", dark ? 85 : 82)};`,
    `  --sky: ${s};`,
    `  --teal: ${t};`,
    `  --teal-2: ${mix(t, dark ? "#ffffff" : "#000000", dark ? 85 : 82)};`,
    `  --primary-rgb: ${hexToRgb(p)};`,
    `  --sky-rgb: ${hexToRgb(s)};`,
    `  --teal-rgb: ${hexToRgb(t)};`,
    `  --soft: ${mix(p, surf, dark ? 32 : 8)};`,
    `  --soft-2: ${mix(p, surf, dark ? 28 : 6)};`,
    `  --soft-line: ${mix(p, surf, dark ? 24 : 12)};`,
    `  --neutral-soft: ${mix(p, surf, dark ? 22 : 7)};`,
    `  --neutral-line: ${mix(p, surf, dark ? 34 : 20)};`,
    `  --line: ${mix(p, surf, lines.a)};`,
    `  --line-2: ${mix(p, surf, lines.a)};`,
    `  --line-3: ${mix(p, surf, lines.c)};`,
    `  --line-4: ${mix(p, surf, lines.b)};`,
    `  --line-5: ${mix(p, surf, lines.a)};`,
    `  --line-6: ${mix(p, surf, lines.d)};`,
    `  --line-7: ${mix(p, surf, lines.a)};`,
    `  --line-8: ${mix(p, surf, lines.c)};`,
    `  --line-9: ${mix(p, surf, lines.c)};`,
    `  --line-10: ${mix(p, surf, lines.c)};`,
    `  --line-11: ${mix(p, surf, lines.d)};`,
    `  --line-strong: ${mix(p, surf, lines.strong)};`,
    `  --line-stronger: ${mix(p, surf, lines.stronger)};`,
    `  --line-glass: ${mix(p, "transparent", dark ? 26 : 16)};`,
    `  --glass-tint: ${mix(t, "transparent", dark ? 18 : 14)};`,
    `  --success: ${mix(t, bg, dark ? 66 : 58)};`,
    `  --success-2: ${mix(t, bg, dark ? 72 : 50)};`,
    `  --success-3: ${mix(t, bg, dark ? 66 : 60)};`,
    `  --success-soft: ${mix(t, bg, dark ? 16 : 8)};`,
    `  --success-soft-2: ${mix(t, bg, dark ? 16 : 8)};`,
    `  --success-soft-3: ${mix(t, bg, dark ? 26 : 30)};`,
    `  --success-soft-4: ${mix(t, bg, dark ? 18 : 13)};`,
    `  --navy: ${mix(p, bg, dark ? 45 : 32)};`,
  ].join("\n");
}

export function buildThemeStyle(palette: Palette): string {
  return [
    ':root:root {',
    buildMode(palette.light, false),
    '}',
    ':root[data-theme="dark"] {',
    buildMode(palette.dark, true),
    '}',
  ].join("\n");
}

export function sanitizePalette(input: unknown): Palette | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, Record<string, unknown>>;
  const modes: (keyof Palette)[] = ["light", "dark"];
  const keys: (keyof PaletteMode)[] = ["primary", "sky", "teal"];
  const out: Palette = {
    light: { primary: "", sky: "", teal: "" },
    dark: { primary: "", sky: "", teal: "" },
  };
  for (const mode of modes) {
    const m = o[mode];
    if (!m || typeof m !== "object") return null;
    for (const k of keys) {
      const v = m[k];
      if (!isHexColor(v)) return null;
      out[mode][k] = v.toLowerCase();
    }
  }
  return out;
}
