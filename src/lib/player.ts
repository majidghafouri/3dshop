let audio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
const listeners = new Set<() => void>();

const VOLUME_KEY = "figureforge-volume-v2";
export const DEFAULT_VOLUME = 0.1;

function loadVolume(): number {
  if (typeof window === "undefined") return DEFAULT_VOLUME;
  const raw = window.localStorage.getItem(VOLUME_KEY);
  if (raw === null) return DEFAULT_VOLUME;
  const v = Number(raw);
  return Number.isFinite(v) && v >= 0 && v <= 1 ? v : DEFAULT_VOLUME;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getState() {
  const a = audio;
  return {
    url: currentUrl,
    playing: a ? !a.paused : false,
    muted: a ? a.muted : false,
    volume: a ? a.volume : loadVolume(),
  };
}

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.volume = loadVolume();
    audio.loop = true;
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
    audio.addEventListener("volumechange", emit);
  }
  return audio;
}

export function setVolume(volume: number) {
  const a = getAudio();
  const next = Math.min(1, Math.max(0, volume));
  a.volume = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(VOLUME_KEY, String(next));
  }
  emit();
}

export function playTrack(url: string) {
  const a = getAudio();
  if (currentUrl === url && a.getAttribute("src")) {
    if (!a.paused) return;
    void a.play().catch(() => {
      /* blocked by autoplay policy until first user gesture */
    });
    return;
  }
  currentUrl = url;
  a.pause();
  a.removeAttribute("src");
  a.load();
  a.src = url;
  a.currentTime = 0;
  void a.play().catch(() => {
    /* blocked by autoplay policy until first user gesture */
  });
  emit();
}

export function pausePlayback() {
  const a = audio;
  if (a) a.pause();
  emit();
}

export function toggleMute() {
  const a = getAudio();
  a.muted = !a.muted;
  emit();
}
