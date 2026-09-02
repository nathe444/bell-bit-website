"use client";

import { useEffect, useRef } from "react";
import { heroSecondary } from "@/lib/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { heroBehavior } from "./hero.config";

type HeroOverlayProps = {
  progressRef: React.RefObject<number>;
};

/** Fade in after primary copy clears; stays fully visible until Trust enters. */
function secondaryFadeIn(progress: number) {
  return Math.min(1, Math.max(0, (progress - 0.4) / 0.12));
}

/**
 * Typography and CTAs. Reads scroll progress from a ref every animation frame
 * and writes it to a CSS custom property, so the fade/parallax is driven
 * entirely by CSS transitions rather than per-frame React re-renders.
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
      const secondary =
        secondaryFadeIn(p) * (1 - Math.min(1, Math.max(0, trustCoverRef.current)));

      el.style.setProperty("--hero-progress", p.toFixed(4));
      el.style.setProperty("--hero-secondary", secondary.toFixed(4));

      const primaryVisible = 1 - p * 1.75 > 0.1;
      el.style.pointerEvents = primaryVisible || secondary > 0.5 ? "auto" : "none";
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

  return (
    <div
      ref={rootRef}
      className="relative z-10 flex h-full w-full flex-col justify-between"
      style={
        {
          "--hero-progress": 0,
          "--hero-secondary": 0,
        } as React.CSSProperties
      }
    >
      <div className="container-edge flex flex-1 flex-col justify-center">
        <div className="relative w-full">
          {/* Primary — fades out as the frame sequence advances */}
          <div
            className="max-w-4xl"
            style={{
              opacity: "calc(1 - var(--hero-progress) * 1.75)",
              transform: "translateY(calc(var(--hero-progress) * -32px))",
              transition: "opacity 0.1s linear",
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
              BellBit builds intelligent software and digital products that turn complex business
              problems into simple, scalable experiences.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <MagneticButton
                as="a"
                href="#contact"
                className="inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-on-signal"
              >
                Let&rsquo;s work together
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#projects"
                className="inline-flex items-center gap-2 border-b border-scene-line-strong pb-1 text-sm font-medium uppercase tracking-wide text-scene-paper-dim transition-colors hover:border-signal-soft hover:text-scene-paper"
              >
                See our work
              </MagneticButton>
            </div>
          </div>

          {/* Secondary — holds until Trust / Clients & Partners scrolls in */}
          <div
            className="mt-14 max-w-md md:absolute md:right-0 md:top-1/2 md:mt-0 md:max-w-sm md:-translate-y-1/2 lg:max-w-md"
            style={{ opacity: "var(--hero-secondary)" }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
              {heroSecondary.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-2xl font-medium leading-tight text-scene-paper md:text-3xl">
              {heroSecondary.title}
            </h2>
            <ul className="mt-6 space-y-4 border-l border-scene-line-strong pl-5">
              {heroSecondary.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-scene-paper-dim md:text-base">
                  {item}
                </li>
              ))}
            </ul>
            <MagneticButton
              as="a"
              href="#trust"
              className="mt-8 inline-flex items-center gap-2 border-b border-scene-line-strong pb-1 text-sm font-medium uppercase tracking-wide text-scene-paper-dim transition-colors hover:border-signal-soft hover:text-scene-paper"
            >
              Meet our clients
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        className="container-edge flex items-center justify-between pb-10 text-xs uppercase tracking-[0.25em] text-scene-paper-faint"
        style={{
          opacity: "calc(1 - var(--hero-progress) * 2.2)",
        }}
      >
        <span>Complexity</span>
        <span className="h-px flex-1 mx-6 bg-scene-line" />
        <span>Structure</span>
        <span className="h-px flex-1 mx-6 bg-scene-line" />
        <span>System</span>
      </div>
    </div>
  );
}
