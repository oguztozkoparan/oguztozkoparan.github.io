export const PRELOADER_EVENT = "ot:preloader-done";

declare global {
  interface Window {
    __otPreloaderDone?: boolean;
  }
}

export function markPreloaderDone() {
  window.__otPreloaderDone = true;
  window.dispatchEvent(new CustomEvent(PRELOADER_EVENT));
}

export function onPreloaderDone(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.__otPreloaderDone) {
      resolve();
      return;
    }
    window.addEventListener(PRELOADER_EVENT, () => resolve(), { once: true });
  });
}
