"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger, ensureGsapRegistered } from "./gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Recalculate every ScrollTrigger after layout shifts (fonts, images, Lenis init). */
function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Drives the whole page with one motion system: Lenis smooths the raw wheel/touch
 * input, and every scroll-linked animation (GSAP ScrollTrigger) reads its position
 * from the same source via the ticker below, so nothing drifts out of sync.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    ensureGsapRegistered();
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Child sections create ScrollTriggers before this effect runs; refresh once
    // Lenis is wired up and again after late layout shifts in production builds.
    refreshScrollTriggers();
    requestAnimationFrame(refreshScrollTriggers);

    const onLoad = () => refreshScrollTriggers();
    window.addEventListener("load", onLoad);

    const lateRefresh = window.setTimeout(refreshScrollTriggers, 500);

    let fontsCancelled = false;
    void document.fonts?.ready.then(() => {
      if (!fontsCancelled) refreshScrollTriggers();
    });

    return () => {
      fontsCancelled = true;
      window.clearTimeout(lateRefresh);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
