const PENDING_HASH_KEY = "bellbit-pending-route-hash";

type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; force?: boolean },
  ) => void;
  resize: () => void;
};

let lenisInstance: LenisLike | null = null;
let armedSectionHash: string | null = null;

function normalizeHash(hash: string) {
  return hash.startsWith("#") ? hash : `#${hash}`;
}

export function registerLenis(lenis: LenisLike | null) {
  lenisInstance = lenis;
}

export function getLenis() {
  return lenisInstance;
}

/** Stores a hash so the next home page visit can jump straight to that section. */
export function setPendingRouteHash(hash: string) {
  const normalized = normalizeHash(hash);
  armedSectionHash = normalized;
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_HASH_KEY, normalized);
}

export function peekRouteHash(): string | null {
  if (armedSectionHash) return armedSectionHash;
  if (typeof window === "undefined") return null;
  if (window.location.hash) return window.location.hash;
  return sessionStorage.getItem(PENDING_HASH_KEY);
}

export function clearPendingRouteHash() {
  armedSectionHash = null;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_HASH_KEY);
}

export function isSectionHash(hash: string | null | undefined) {
  return Boolean(hash) && hash !== "#" && hash !== "#hero";
}

const NAV_SCROLL_OFFSET = -88;
const LANDING_TOP_MIN = 24;
const LANDING_TOP_MAX = 200;

function pendingTarget(): HTMLElement | null {
  const hash = peekRouteHash();
  if (!isSectionHash(hash) || !hash) return null;
  const target = document.querySelector(hash);
  return target instanceof HTMLElement ? target : null;
}

/** True once Work/Services is sitting just below the nav. */
export function hasLandedOnHomeSection() {
  const target = pendingTarget();
  if (!target) return false;
  const top = target.getBoundingClientRect().top;
  return top >= LANDING_TOP_MIN && top <= LANDING_TOP_MAX;
}

/**
 * Jump to a home section without touching the URL hash.
 * Returns true only when the section is actually in the landing band —
 * a clamped Lenis jump into the hero pin counts as a miss.
 */
export function scrollToHomeSection() {
  const target = pendingTarget();
  if (!target) return false;

  if (lenisInstance) {
    lenisInstance.resize();
    lenisInstance.scrollTo(target, {
      offset: NAV_SCROLL_OFFSET,
      immediate: true,
      force: true,
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + NAV_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }

  return hasLandedOnHomeSection();
}
