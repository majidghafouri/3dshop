export type Theme = "dark" | "light";

export const THEME_KEY = "figureforge-theme";
export const DEFAULT_THEME: Theme = "dark";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore storage errors (private mode)
  }
}
