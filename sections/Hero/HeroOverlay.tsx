"use client";

import { useEffect, useRef } from "react";
import { heroPrimary, heroSecondary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { heroBehavior, heroLineOpacity, heroPrimaryOpacity } from "./hero.config";
import { HeroSecondaryCopy } from "./HeroSecondaryCopy";

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
        const reveal = window
          ? heroLineOpacity(p, window, { isLast: index === heroLines.length - 1 })
          : 0;
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
            {heroPrimary.eyebrow}
          </p>
          <h1 className="text-balance font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] text-scene-paper">
            {heroPrimary.headline[0]}
            <br />
            {heroPrimary.headline[1]}
          </h1>
          <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-scene-paper-dim md:text-xl">
            {heroPrimary.description}
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

        {/* Secondary — one line at a time, alternating sides within inset band */}
        <div className="pointer-events-none absolute inset-x-[7%] top-1/2 z-[1] -translate-y-1/2 sm:inset-x-[9%] md:inset-x-[11%] lg:inset-x-[13%]">
          <div className="relative py-6 md:py-10">
            {heroLines.map((line, index) => (
              <div
                key={line}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 will-change-[transform,opacity]",
                  index === 0 ? "max-w-[44rem]" : "max-w-[34rem]",
                  index % 2 === 0 ? "right-0 text-right" : "left-0 text-left",
                )}
                style={lineMotionStyle(index)}
              >
                <HeroSecondaryCopy text={line} />
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
      <div className="container-edge flex flex-col gap-8 md:gap-10">
        {heroLines.map((line, index) => (
          <div
            key={line}
            className={cn(
              index === 0 ? "max-w-[44rem]" : "max-w-[34rem]",
              index % 2 === 0 ? "self-end text-right" : "self-start text-left",
            )}
          >
            <HeroSecondaryCopy text={line} size="static" />
          </div>
        ))}
      </div>
    </div>
  );
}
