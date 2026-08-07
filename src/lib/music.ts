export const MUSIC_KEY = "figurize-music";
export const MUSIC_EVENT = "figurize-music-change";

export function getMusicEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUSIC_KEY) !== "off";
}

export function setMusicEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUSIC_KEY, enabled ? "on" : "off");
  window.dispatchEvent(new CustomEvent(MUSIC_EVENT, { detail: { enabled } }));
}
