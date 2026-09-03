"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroSecondary } from "@/lib/content";
import { HeroCanvas } from "./HeroCanvas";
import { HeroOverlay } from "./HeroOverlay";
import { heroSequence, heroBehavior } from "./hero.config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion) return;

    return runScrollTriggerSetup(() => {
      const scrubTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: heroBehavior.scrubSmoothing,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          // Once the sequence has resolved, gradually darken the frozen final
          // frame so it reads as a backdrop rather than competing with the
          // Trust/Services content sitting on top of it.
          const scrim = Math.max(0, (self.progress - 0.65) / 0.35);
          stickyRef.current?.style.setProperty("--held-scrim", scrim.toFixed(4));
        },
      });

      // Keeps the resolved frame visible as a fixed backdrop behind Trust and
      // Services, fading it out only in the final stretch before Projects
      // takes over with its own solid background — "system" becomes the
      // environment the rest of the proof sits inside, no hard cut.
      const visibilityTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        endTrigger: "#projects",
        end: "top 80%",
        scrub: heroBehavior.scrubSmoothing,
        onUpdate: (self) => {
          const fadeStart = 0.85;
          const visibility =
            self.progress < fadeStart
              ? 1
              : Math.max(0, 1 - (self.progress - fadeStart) / (1 - fadeStart));
          stickyRef.current?.style.setProperty("--backdrop-opacity", visibility.toFixed(4));
          if (stickyRef.current) {
            stickyRef.current.style.visibility = visibility > 0.001 ? "visible" : "hidden";
          }
        },
      });

      return () => {
        scrubTrigger.kill();
        visibilityTrigger.kill();
      };
    });
  }, [reducedMotion]);

  if (reducedMotion) {
    return <HeroStatic />;
  }

  return (
    <section
      ref={wrapperRef}
      id="hero"
      className="relative w-full bg-void"
      style={{ height: `${heroBehavior.pinDistanceVh}vh` }}
    >
      <div
        ref={stickyRef}
        className="fixed inset-0 z-0 h-screen w-full overflow-hidden"
        style={
          {
            "--held-scrim": 0,
            "--backdrop-opacity": 1,
            opacity: "var(--backdrop-opacity)",
          } as React.CSSProperties
        }
      >
        <Image
          src={heroSequence.posterPath}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover transition-opacity duration-700"
          style={{ opacity: firstFrameReady ? 0 : 1 }}
        />
        <HeroCanvas
          key={isSmallScreen ? "mobile" : "desktop"}
          isSmallScreen={isSmallScreen}
          progressRef={progressRef}
          onFirstFrameReady={() => setFirstFrameReady(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scene-void via-scene-void/10 to-scene-void/40" />
        <div
          className="pointer-events-none absolute inset-0 bg-void"
          style={{ opacity: "calc(var(--held-scrim) * 0.75)" }}
        />
        <HeroOverlay progressRef={progressRef} />
      </div>
    </section>
  );
}

/** prefers-reduced-motion: no pinning, no scrub — a single restrained crossfade tells the same story. */
function HeroStatic() {
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setResolved(true), 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-void">
      <Image
        src={heroSequence.posterPath}
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover transition-opacity duration-1000"
        style={{ opacity: resolved ? 0 : 1 }}
      />
      <Image
        src={heroSequence.framePath(heroSequence.frameCount - 1)}
        alt=""
        fill
        aria-hidden="true"
        className="object-cover transition-opacity duration-1000"
        style={{ opacity: resolved ? 1 : 0 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scene-void via-scene-void/10 to-scene-void/40" />
      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="container-edge relative w-full">
          <div className="max-w-4xl">
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
              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-on-signal"
              >
                Let&rsquo;s work together
              </a>
            </div>
          </div>

          <div className="mt-14 max-w-md md:absolute md:right-0 md:top-1/2 md:mt-0 md:max-w-md md:-translate-y-1/2 lg:max-w-lg">
            <h2 className="font-display text-3xl font-medium leading-tight text-scene-paper md:text-4xl">
              {heroSecondary.title}
            </h2>
            {heroSecondary.items.map((item, index) => (
              <p
                key={item}
                className={`text-base leading-relaxed text-scene-paper-dim md:text-lg ${index === 0 ? "mt-6" : "mt-5"}`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
