"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger, ensureGsapRegistered } from "./gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  clearPendingRouteHash,
  isSectionHash,
  peekRouteHash,
  registerLenis,
  scrollToHomeSection,
} from "@/lib/routeScroll";

/** Recalculate every ScrollTrigger after layout shifts (fonts, images, Lenis init). */
function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

const NAV_SCROLL_OFFSET = -88;

function stripHashFromUrl() {
  if (!window.location.hash) return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

function getHashAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  const anchor = (target as HTMLElement | null)?.closest("a[href^='#']");
  return anchor instanceof HTMLAnchorElement ? anchor : null;
}

/**
 * Drives the whole page with one motion system: Lenis smooths the raw wheel/touch
 * input, and every scroll-linked animation (GSAP ScrollTrigger) reads its position
 * from the same source via the ticker below, so nothing drifts out of sync.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    ensureGsapRegistered();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let lateRefresh: number | undefined;
    let onLoad: (() => void) | undefined;
    let fontsCancelled = false;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });

      registerLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      refreshScrollTriggers();
      requestAnimationFrame(refreshScrollTriggers);

      onLoad = () => refreshScrollTriggers();
      window.addEventListener("load", onLoad);

      lateRefresh = window.setTimeout(refreshScrollTriggers, 500);

      void document.fonts?.ready.then(() => {
        if (!fontsCancelled) refreshScrollTriggers();
      });
    }

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = getHashAnchor(event.target);
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const element = document.querySelector(hash);
      if (!element) return;

      event.preventDefault();

      if (lenis) {
        lenis.scrollTo(hash, {
          offset: NAV_SCROLL_OFFSET,
          onComplete: () => {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          },
        });
        return;
      }

      if (!(element instanceof HTMLElement)) return;

      element.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      fontsCancelled = true;
      document.removeEventListener("click", onAnchorClick);

      if (onLoad) {
        window.removeEventListener("load", onLoad);
      }

      if (lateRefresh !== undefined) {
        window.clearTimeout(lateRefresh);
      }

      if (tick) {
        gsap.ticker.remove(tick);
      }

      registerLenis(null);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    stripHashFromUrl();

    if (pathname !== "/" || !isSectionHash(peekRouteHash())) {
      return;
    }

    let cancelled = false;
    let tries = 0;
    let landedAt: number | null = null;
    const maxTries = 48;
    const settleMs = 400;
    const timers: number[] = [];

    const jump = () => {
      if (cancelled) return false;
      return scrollToHomeSection();
    };

    const finish = () => {
      jump();
      clearPendingRouteHash();
    };

    const schedule = (delay: number) => {
      timers.push(window.setTimeout(tick, delay));
    };

    const tick = () => {
      if (cancelled) return;

      const landed = jump();
      const now = Date.now();

      if (landed) {
        if (landedAt === null) landedAt = now;
        if (now - landedAt >= settleMs) {
          clearPendingRouteHash();
          return;
        }
        schedule(50);
        return;
      }

      landedAt = null;
      tries += 1;
      if (tries >= maxTries) {
        finish();
        return;
      }

      schedule(tries < 10 ? 50 : 80);
    };

    jump();
    const frame = requestAnimationFrame(tick);
    ScrollTrigger.addEventListener("refresh", jump);

    return () => {
      cancelled = true;
      ScrollTrigger.removeEventListener("refresh", jump);
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
