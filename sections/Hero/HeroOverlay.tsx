"use client";

import { useEffect, useRef } from "react";
import { heroSecondary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { heroBehavior, heroLineOpacity, heroPrimaryOpacity } from "./hero.config";

type HeroOverlayProps = {
  progressRef: React.RefObject<number>;
};

const heroLines = heroSecondary.items;

function lineMotionStyle(index: number): React.CSSProperties {
  const offset = index % 2 === 0 ? 44 : -44;
  return {
    opacity: `var(--hero-line-${index})`,
    transform: `translate3d(calc((1 - var(--hero-line-${index})) * ${offset}px), calc((1 - var(--hero-line-${index})) * 28px), 0)`,
  };
}

/**
 * Typography and CTAs. Reads scroll progress from a ref every animation frame
 * and writes it to CSS custom properties, so motion is driven without React re-renders.
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
      const primary = heroPrimaryOpacity(p);

      el.style.setProperty("--hero-progress", p.toFixed(4));
      el.style.setProperty("--hero-primary", primary.toFixed(4));

      let secondaryPeak = 0;

      heroLines.forEach((_, index) => {
        const window = heroBehavior.secondaryLineWindows[index];
        const reveal = window ? heroLineOpacity(p, window) : 0;
        el.style.setProperty(`--hero-line-${index}`, reveal.toFixed(4));
        secondaryPeak = Math.max(secondaryPeak, reveal);
      });

      el.style.pointerEvents = primary > 0.12 || secondaryPeak > 0.45 ? "auto" : "none";
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lineVars = Object.fromEntries(
    heroLines.map((_, index) => [`--hero-line-${index}`, 0]),
  ) as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className="relative z-10 flex h-full w-full flex-col justify-between"
      style={
        {
          ...lineVars,
          "--hero-progress": 0,
          "--hero-primary": 1,
        } as React.CSSProperties
      }
    >
      <div className="container-edge relative flex flex-1 flex-col justify-center">
        {/* Primary — fades out as the frame sequence advances */}
        <div
          className="relative z-[2] max-w-4xl"
          style={{
            opacity: "var(--hero-primary)",
            transform: "translateY(calc((1 - var(--hero-primary)) * -28px))",
          }}
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
            BellBit Software Technologies
          </p>
          <h1 className="text-balance font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] text-scene-paper">
            We turn complexity
            <br />
            into systems.
          </h1>
          <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-scene-paper-dim md:text-xl">
            BellBit builds intelligent systems and digital products that turn complex business
            problems into simple, scalable experiences.
          </p>

          <div className="mt-10">
            <MagneticButton
              as="a"
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-on-signal"
            >
              Let&rsquo;s work together
            </MagneticButton>
          </div>
        </div>

        {/* Secondary — one line at a time, alternating sides with inset padding */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2">
          <div className="container-edge relative py-6 md:py-10">
            {heroLines.map((line, index) => (
              <div
                key={line}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 will-change-[transform,opacity]",
                  index === 0 ? "max-w-[min(100%,44rem)]" : "max-w-[min(100%,34rem)]",
                  index % 2 === 0
                    ? "right-[7%] text-right sm:right-[9%] md:right-[11%] lg:right-[13%]"
                    : "left-[7%] text-left sm:left-[9%] md:left-[11%] lg:left-[13%]",
                )}
                style={lineMotionStyle(index)}
              >
                <p className="text-balance font-display text-[clamp(2rem,4.8vw,3.75rem)] font-light leading-snug text-scene-paper">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="container-edge flex items-center justify-between pb-10 text-xs uppercase tracking-[0.25em] text-scene-paper-faint"
        style={{
          opacity: "var(--hero-primary)",
        }}
      >
        <span>Complexity</span>
        <span className="mx-6 h-px flex-1 bg-scene-line" />
        <span>Structure</span>
        <span className="mx-6 h-px flex-1 bg-scene-line" />
        <span>System</span>
      </div>
    </div>
  );
}

export function HeroSecondaryStatic() {
  return (
    <div className="mt-14 md:mt-0 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2">
      <div className="container-edge flex flex-col gap-8 px-6 md:gap-10 md:px-10">
        {heroLines.map((line, index) => (
          <div
            key={line}
            className={cn(
              index === 0 ? "max-w-[min(100%,44rem)]" : "max-w-[min(100%,34rem)]",
              index % 2 === 0
                ? "self-end pr-[7%] text-right sm:pr-[9%] md:pr-[11%]"
                : "self-start pl-[7%] text-left sm:pl-[9%] md:pl-[11%]",
            )}
          >
            <p className="text-balance font-display text-[clamp(1.5rem,3.5vw,2.65rem)] font-light leading-snug text-scene-paper">
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
