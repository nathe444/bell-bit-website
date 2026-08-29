"use client";

import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

type HeroOverlayProps = {
  progressRef: React.RefObject<number>;
};

/**
 * Typography and CTAs. Reads scroll progress from a ref every animation frame
 * and writes it to a CSS custom property, so the fade/parallax is driven
 * entirely by CSS transitions rather than per-frame React re-renders.
 */
export function HeroOverlay({ progressRef }: HeroOverlayProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const el = rootRef.current;
      if (!el) return;
      const p = Math.min(1, Math.max(0, progressRef.current ?? 0));
      el.style.setProperty("--hero-progress", p.toFixed(4));
      // Once faded, stop intercepting clicks so the persistent backdrop
      // never blocks interaction with Trust/Services content sitting above it.
      el.style.pointerEvents = p > 0.45 ? "none" : "auto";
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative z-10 flex h-full w-full flex-col justify-between"
      style={
        {
          "--hero-progress": 0,
        } as React.CSSProperties
      }
    >
      <div className="container-edge flex flex-1 flex-col justify-center">
        <div
          className="max-w-4xl"
          style={{
            opacity: "calc(1 - var(--hero-progress) * 2.4)",
            transform: "translateY(calc(var(--hero-progress) * -40px))",
            transition: "opacity 0.1s linear",
          }}
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
            BellBit Software Technologies
          </p>
          <h1 className="text-balance font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] text-paper">
            We turn complexity
            <br />
            into systems.
          </h1>
          <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-paper-dim md:text-xl">
            BellBit builds software products and custom digital solutions that
            solve real business problems — through reliable, scalable, and
            well-designed systems.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton
              as="a"
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-void"
            >
              Let&rsquo;s work together
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#projects"
              className="inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm font-medium uppercase tracking-wide text-paper-dim transition-colors hover:border-signal-soft hover:text-paper"
            >
              Explore our work
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        className="container-edge flex items-center justify-between pb-10 text-xs uppercase tracking-[0.25em] text-paper-faint"
        style={{
          opacity: "calc(1 - var(--hero-progress) * 3)",
        }}
      >
        <span>Complexity</span>
        <span className="h-px flex-1 mx-6 bg-line" />
        <span>Structure</span>
        <span className="h-px flex-1 mx-6 bg-line" />
        <span>System</span>
      </div>
    </div>
  );
}
