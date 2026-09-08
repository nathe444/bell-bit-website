/** Session-only flags so the hero boot screen runs once per tab visit. */
const BOOT_STORAGE_KEY = "bellbit-hero-boot-dismissed";
export const HERO_REPAINT_EVENT = "bellbit:hero-repaint";

let bootScreenDismissed = false;

if (typeof window !== "undefined") {
  bootScreenDismissed = sessionStorage.getItem(BOOT_STORAGE_KEY) === "1";
}

function readPersistedBootDismissed() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(BOOT_STORAGE_KEY) === "1";
}

export function wasHeroBootScreenDismissed() {
  return bootScreenDismissed || readPersistedBootDismissed();
}

export function markHeroBootScreenDismissed() {
  bootScreenDismissed = true;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
  }
}

export function requestHeroRepaint() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HERO_REPAINT_EVENT));
}
