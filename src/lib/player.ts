let audio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
const listeners = new Set<() => void>();

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
  };
}

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.loop = true;
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
    audio.addEventListener("volumechange", emit);
  }
  return audio;
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
