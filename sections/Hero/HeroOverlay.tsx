"use client";

import { useEffect, useRef } from "react";
import { heroSecondary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { heroBehavior, heroLineReveal, heroPrimaryOpacity } from "./hero.config";

type HeroOverlayProps = {
  progressRef: React.RefObject<number>;
};

const heroLines = [heroSecondary.title, ...heroSecondary.items] as const;

function lineMotionStyle(index: number): React.CSSProperties {
  const offset = index % 2 === 0 ? -56 : 56;
  return {
    opacity: `var(--hero-line-${index})`,
    transform: `translate3d(calc((1 - var(--hero-line-${index})) * ${offset}px), calc((1 - var(--hero-line-${index})) * 32px), 0)`,
  };
}

/**
 * Typography and CTAs. Reads scroll progress from a ref every animation frame
 * and writes it to CSS custom properties, so motion is driven without React re-renders.
 */
export function HeroOverlay({ progressRef }: HeroOverlayProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trustCoverRef = useRef(0);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const el = rootRef.current;
      if (!el) return;

      const p = Math.min(1, Math.max(0, progressRef.current ?? 0));
      const trustCover = Math.min(1, Math.max(0, trustCoverRef.current));
      const trustMultiplier = 1 - trustCover;
      const primary = heroPrimaryOpacity(p);

      el.style.setProperty("--hero-progress", p.toFixed(4));
      el.style.setProperty("--hero-primary", primary.toFixed(4));

      let secondaryPeak = 0;

      heroLines.forEach((_, index) => {
        const reveal =
          heroLineReveal(p, heroBehavior.secondaryLineStarts[index] ?? 0.24) * trustMultiplier;
        el.style.setProperty(`--hero-line-${index}`, reveal.toFixed(4));
        secondaryPeak = Math.max(secondaryPeak, reveal);
      });

      const ctaReveal = heroLineReveal(p, heroBehavior.secondaryCtaStart) * trustMultiplier;
      el.style.setProperty("--hero-cta", ctaReveal.toFixed(4));
      secondaryPeak = Math.max(secondaryPeak, ctaReveal);

      el.style.pointerEvents = primary > 0.12 || secondaryPeak > 0.45 ? "auto" : "none";
    };
    rafId = requestAnimationFrame(tick);

    const cleanupScroll = runScrollTriggerSetup(() => {
      const trustTrigger = ScrollTrigger.create({
        trigger: "#trust",
        start: "top bottom",
        end: "top 88%",
        scrub: heroBehavior.scrubSmoothing,
        onUpdate: (self) => {
          trustCoverRef.current = self.progress;
        },
      });
      return () => trustTrigger.kill();
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanupScroll?.();
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
          "--hero-cta": 0,
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

        {/* Secondary — each line reveals in sync with the frame scrub, alternating sides */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2">
          <div className="container-edge flex flex-col gap-8 py-6 md:gap-12 md:py-10">
            {heroLines.map((line, index) => (
              <div
                key={line}
                className={cn(
                  "max-w-[min(100%,44rem)] will-change-[transform,opacity]",
                  index % 2 === 0 ? "self-start text-left" : "self-end text-right",
                )}
                style={lineMotionStyle(index)}
              >
                {index === 0 ? (
                  <h2 className="text-balance font-display text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.05] text-scene-paper">
                    {line}
                  </h2>
                ) : (
                  <p className="text-balance font-display text-[clamp(1.35rem,3.4vw,2.65rem)] font-light leading-snug text-scene-paper-dim">
                    {line}
                  </p>
                )}
              </div>
            ))}

            <div
              className="pointer-events-auto self-center will-change-[transform,opacity]"
              style={{
                opacity: "var(--hero-cta)",
                transform:
                  "translate3d(0, calc((1 - var(--hero-cta)) * 24px), 0)",
              }}
            >
              <MagneticButton
                as="a"
                href="#trust"
                className="inline-flex items-center gap-2 border-b border-scene-line-strong pb-1 text-sm font-medium uppercase tracking-wide text-scene-paper-dim transition-colors hover:border-signal-soft hover:text-scene-paper"
              >
                Meet our clients
              </MagneticButton>
            </div>
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
    <div className="mt-14 flex flex-col gap-8 md:mt-0 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:gap-10">
      <div className="container-edge flex flex-col gap-8 md:gap-10">
        {heroLines.map((line, index) => (
          <div
            key={line}
            className={cn(
              "max-w-[min(100%,44rem)]",
              index % 2 === 0 ? "self-start text-left" : "self-end text-right",
            )}
          >
            {index === 0 ? (
              <h2 className="text-balance font-display text-[clamp(2rem,5.5vw,3.5rem)] font-medium leading-[1.05] text-scene-paper">
                {line}
              </h2>
            ) : (
              <p className="text-balance font-display text-[clamp(1.25rem,3vw,2.25rem)] font-light leading-snug text-scene-paper-dim">
                {line}
              </p>
            )}
          </div>
        ))}
        <div className="self-center">
          <a
            href="#trust"
            className="inline-flex items-center gap-2 border-b border-scene-line-strong pb-1 text-sm font-medium uppercase tracking-wide text-scene-paper-dim"
          >
            Meet our clients
          </a>
        </div>
      </div>
    </div>
  );
}
