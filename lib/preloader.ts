export const PRELOADER_EVENT = "ot:preloader-done";

declare global {
  interface Window {
    __otPreloaderDone?: boolean;
    __otPreloaderPresent?: boolean;
  }
}

// called from the Preloader component's render so pages without a
// preloader (sub-routes) resolve immediately
export function markPreloaderPresent() {
  window.__otPreloaderPresent = true;
}

export function markPreloaderDone() {
  window.__otPreloaderDone = true;
  window.dispatchEvent(new CustomEvent(PRELOADER_EVENT));
}

export function onPreloaderDone(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.__otPreloaderDone || !window.__otPreloaderPresent) {
      resolve();
      return;
    }
    window.addEventListener(PRELOADER_EVENT, () => resolve(), { once: true });
  });
}
