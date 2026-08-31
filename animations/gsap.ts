"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once, safe to call from any client component. */
export function ensureGsapRegistered() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Runs ScrollTrigger setup on the next frame so Lenis (initialized in the
 * parent SmoothScrollProvider effect) is already attached.
 */
export function runScrollTriggerSetup(setup: () => (() => void) | void) {
  ensureGsapRegistered();
  let cleanup: (() => void) | void;

  const rafId = requestAnimationFrame(() => {
    cleanup = setup();
    ScrollTrigger.refresh();
  });

  return () => {
    cancelAnimationFrame(rafId);
    cleanup?.();
  };
}

export { gsap, ScrollTrigger };
