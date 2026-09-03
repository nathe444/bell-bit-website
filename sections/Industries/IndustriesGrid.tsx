"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { industries as industriesType } from "@/lib/content";
import { ensureGsapRegistered, gsap, runScrollTriggerSetup } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Industry = (typeof industriesType)[number];

type IndustriesGridProps = {
  industries: readonly Industry[];
};

const cardSpanClass = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
] as const;

function getBorderColors() {
  const styles = getComputedStyle(document.documentElement);
  const signalSoft = styles.getPropertyValue("--color-signal-soft").trim();
  const lineStrong = styles.getPropertyValue("--color-line-strong").trim();

  return {
    dim: `color-mix(in srgb, ${lineStrong} 35%, transparent)`,
    lit: `color-mix(in srgb, ${signalSoft} 35%, transparent)`,
    signalSoft,
  };
}

function queryGridParts(grid: HTMLElement) {
  const rail = grid.querySelector<HTMLElement>('[data-role="bus-rail"]');
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-role="card"]'));
  const scans = cards.map((card) => card.querySelector<HTMLElement>('[data-role="scan"]'));
  const glows = cards.map((card) => card.querySelector<HTMLElement>('[data-role="glow"]'));
  const texts = cards.map((card) => card.querySelector<HTMLElement>('[data-role="text"]'));
  const labels = cards.map((card) => card.querySelector<HTMLElement>('[data-role="label"]'));

  return { rail, cards, scans, glows, texts, labels };
}

function setPoweredState(grid: HTMLElement, hideScans = true) {
  ensureGsapRegistered();
  const { rail, cards, scans, glows, texts, labels } = queryGridParts(grid);
  const { lit } = getBorderColors();

  gsap.set(rail, { scaleX: 1, transformOrigin: "left center" });
  gsap.set(cards, { borderColor: lit });
  gsap.set(scans, hideScans ? { autoAlpha: 0 } : { xPercent: 220, autoAlpha: 0 });
  gsap.set(glows, { autoAlpha: 0.45 });
  gsap.set(texts, { autoAlpha: 1, y: 0 });
  gsap.set(labels, { autoAlpha: 1, scale: 1 });
}

function setUnpoweredState(grid: HTMLElement) {
  ensureGsapRegistered();
  const { rail, cards, scans, glows, texts, labels } = queryGridParts(grid);
  const { dim } = getBorderColors();

  gsap.set(rail, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(cards, { borderColor: dim });
  gsap.set(scans, { xPercent: -120, autoAlpha: 1 });
  gsap.set(glows, { autoAlpha: 0 });
  gsap.set(texts, { autoAlpha: 0, y: 8 });
  gsap.set(labels, { autoAlpha: 0, scale: 0.96 });
}

export function IndustriesGrid({ industries }: IndustriesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const primedRef = useRef(false);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reducedMotion) return;

    setUnpoweredState(grid);
    primedRef.current = true;
  }, [reducedMotion]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (reducedMotion) {
      setPoweredState(grid);
      return;
    }

    return runScrollTriggerSetup(() => {
      if (!primedRef.current) {
        setUnpoweredState(grid);
        primedRef.current = true;
      }

      const { rail, cards, scans, glows, texts, labels } = queryGridParts(grid);
      const { lit } = getBorderColors();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 78%",
          once: true,
        },
      });

      tl.to(rail, { scaleX: 1, duration: 0.8, ease: "power2.inOut" })
        .to(
          cards,
          { borderColor: lit, duration: 0.4, ease: "power2.out", stagger: 0.12 },
          "-=0.3",
        )
        .to(scans, { xPercent: 220, duration: 0.6, ease: "power1.out", stagger: 0.12 }, "<")
        .to(texts, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.12 }, "<0.1")
        .to(glows, { autoAlpha: 0.45, duration: 0.6, ease: "power1.out", stagger: 0.12 }, "<")
        .to(
          labels,
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)", stagger: 0.12 },
          "<0.15",
        )
        .set(scans, { autoAlpha: 0 });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
  }, [reducedMotion, industries.length]);

  return (
    <div ref={gridRef} className="relative mt-16">
      <div className="relative mb-5 h-px md:mb-6">
        <div
          data-role="bus-rail"
          aria-hidden
          className="absolute inset-0 origin-left bg-gradient-to-r from-signal-soft/0 via-signal-soft/50 to-signal-soft/0"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6 lg:gap-4">
        {industries.map((industry, index) => (
          <div
            key={industry.id}
            data-role="card"
            className={`group relative flex min-h-[11.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-line/40 bg-surface/35 p-6 backdrop-blur-sm transition-[background-color] duration-500 md:min-h-[12.5rem] md:p-7 ${cardSpanClass[index] ?? "lg:col-span-2"}`}
          >
            <div
              data-role="scan"
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-1/4 bg-gradient-to-r from-transparent via-signal-soft/10 to-transparent opacity-0"
            />
            <div
              data-role="glow"
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-signal-soft/5 blur-xl"
            />

            <div data-role="text" className="relative z-[2]">
              <h3 className="font-display text-xl font-medium leading-tight tracking-tight text-paper md:text-2xl">
                {industry.name}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-sm leading-relaxed text-paper-dim md:mt-3">
                {industry.description}
              </p>
            </div>

            <p
              data-role="label"
              aria-label={`Seen in ${industry.project}`}
              className="relative z-[2] mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-line-strong bg-void/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-signal-soft"
            >
              <span aria-hidden className="h-1 w-1 rounded-full bg-signal-soft/80" />
              {industry.project}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
