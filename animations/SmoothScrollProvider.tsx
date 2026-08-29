"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger, ensureGsapRegistered } from "./gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
