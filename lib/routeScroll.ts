const PENDING_HASH_KEY = "bellbit-pending-route-hash";

type LenisLike = {
  scrollTo: (target: number | string, options?: { offset?: number; immediate?: boolean }) => void;
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

/** Collapse the pinned hero and jump to a home section. Call from useLayoutEffect. */
export function landOnHomeSection() {
  const hash = peekRouteHash();
  if (!isSectionHash(hash) || !hash) return false;

  const hero = document.getElementById("hero");
  if (hero) {
    hero.style.height = "0px";
    hero.style.minHeight = "0px";
    hero.style.overflow = "hidden";
    hero.setAttribute("data-hero-collapsed", "true");
  }

  const sticky = document.querySelector<HTMLElement>("[data-hero-sticky]");
  if (sticky) {
    sticky.style.display = "none";
  }

  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return false;

  const top = target.getBoundingClientRect().top + window.scrollY + NAV_SCROLL_OFFSET;
  window.scrollTo(0, Math.max(0, top));
  lenisInstance?.scrollTo(window.scrollY, { immediate: true });
  clearPendingRouteHash();
  return true;
}
