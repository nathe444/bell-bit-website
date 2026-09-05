"use client";

import { useEffect, useRef, useState } from "react";
import type { technologyGroups as technologyGroupsType } from "@/lib/content";
import { ensureGsapRegistered, gsap, ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TechnologyGroupPanel } from "./TechnologyGroupPanel";
import { technologyBehavior } from "./technology.config";

type TechnologyGroup = (typeof technologyGroupsType)[number];

type TechnologyStageProps = {
  groups: readonly TechnologyGroup[];
  title: string;
};

/** Deep in the screen — arrives toward the viewer. */
const PANEL_ENTER = {
  opacity: 0,
  scale: 0.68,
  z: -520,
  transformOrigin: "50% 50%",
} as const;

const PANEL_SETTLED = {
  opacity: 1,
  scale: 1,
  z: 0,
  transformOrigin: "50% 50%",
} as const;

/** Exits into the screen — stays inside the clipped stage (no bleed over other sections). */
const PANEL_EXIT = {
  opacity: 0,
  scale: 0.82,
  z: -420,
  transformOrigin: "50% 50%",
} as const;

function flattenPanels(
  panels: Array<HTMLDivElement | null>,
  activeIndex = panels.length - 1,
) {
  panels.forEach((panel, i) => {
    if (!panel) return;
    const isActive = i === activeIndex;
    gsap.set(panel, {
      opacity: isActive ? 1 : 0,
      scale: 1,
      z: 0,
      force3D: false,
      clearProps: "transform",
    });
  });
}

function clampHiddenPanels(panels: Array<HTMLDivElement | null>, activeIndex: number) {
  panels.forEach((panel, i) => {
    if (!panel || i === activeIndex) return;
    const opacity = Number(gsap.getProperty(panel, "opacity") ?? 0);
    if (opacity < 0.08) {
      gsap.set(panel, { opacity: 0, scale: 1, z: 0, force3D: false });
    }
  });
}

function getVisibleIndex(panels: Array<HTMLDivElement | null>) {
  let bestIndex = 0;
  let bestOpacity = -1;
  panels.forEach((el, i) => {
    if (!el) return;
    const opacity = Number(gsap.getProperty(el, "opacity") ?? 0);
    const isClearer = opacity > bestOpacity + 0.05;
    const isTiePreferLater =
      Math.abs(opacity - bestOpacity) <= 0.05 && opacity > 0.15 && i > bestIndex;
    if (isClearer || isTiePreferLater) {
      bestOpacity = opacity;
      bestIndex = i;
    }
  });
  return bestIndex;
}

export function TechnologyStage({ groups, title }: TechnologyStageProps) {
  const reducedMotion = useReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  if (reducedMotion || isSmallScreen) {
    return <TechnologyStageStatic groups={groups} title={title} />;
  }

  return <TechnologyStageMotion groups={groups} title={title} />;
}

function TechnologyStageMotion({ groups, title }: TechnologyStageProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return runScrollTriggerSetup(() => {
      ensureGsapRegistered();
      const pinEl = pinRef.current;
      if (!pinEl) return;

      const count = groups.length;
      const panels = panelRefs.current;
      const {
        enterDuration,
        holdDuration,
        exitDuration,
        firstStackHoldDuration,
        vhPerGroup,
        scrubSmoothing,
        enterEase,
        exitEase,
      } = technologyBehavior;

      panels.forEach((panel, i) => {
        if (!panel) return;
        gsap.set(panel, {
          ...(i === 0 ? PANEL_SETTLED : PANEL_ENTER),
          force3D: true,
        });
      });

      const tl = gsap.timeline();

      groups.forEach((_, i) => {
        const panel = panels[i];
        if (!panel) return;
        const label = `stack-${i}`;
        tl.addLabel(label);

        if (i === 0) {
          // Stack 1: visible on arrival, no enter/exit animation while viewing.
          tl.to({}, { duration: firstStackHoldDuration }, label);
          return;
        }

        if (i === 1 && panels[0]) {
          tl.set(panels[0], { ...PANEL_EXIT, force3D: true }, label);
        }

        tl.fromTo(
          panel,
          { ...PANEL_ENTER },
          {
            ...PANEL_SETTLED,
            duration: enterDuration,
            ease: enterEase,
            force3D: true,
          },
          label,
        );

        tl.to(panel, { duration: holdDuration }, `${label}+=${enterDuration}`);

        if (i < count - 1) {
          tl.to(
            panel,
            { ...PANEL_EXIT, duration: exitDuration, ease: exitEase, force3D: true },
            `${label}+=${enterDuration + holdDuration}`,
          );
        }
      });

      const trigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${window.innerHeight * tl.duration() * vhPerGroup}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 0,
        scrub: scrubSmoothing,
        animation: tl,
        onUpdate: (self) => {
          const index = getVisibleIndex(panels);
          clampHiddenPanels(panels, index);

          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }

          if (self.progress >= 0.999 && self.direction === 1) {
            flattenPanels(panels, count - 1);
          }
        },
        onLeave: () => {
          flattenPanels(panels, count - 1);
        },
        onLeaveBack: () => {
          flattenPanels(panels, 0);
        },
        onEnterBack: () => {
          flattenPanels(panels, count - 1);
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        trigger.kill();
        tl.kill();
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length]);

  return (
    <section id="technology" className="relative isolate bg-ink pb-10 md:pb-14">
      <div ref={pinRef} className="relative">
        <div
          className="relative h-[100svh] w-full overflow-hidden"
          style={{ clipPath: "inset(0 round 0)" }}
        >
          <div
            className="container-edge absolute inset-0 mx-auto flex max-w-6xl flex-col px-4 pb-10 pt-24 md:pb-12 md:pt-28"
            style={{ perspective: "1400px" }}
          >
            {groups.map((group, index) => (
              <div
                key={group.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className="absolute inset-0 flex flex-col px-4 pb-10 pt-24 md:pb-12 md:pt-28"
                style={{
                  ...(index === 0
                    ? { opacity: 1, transform: "translate3d(0px, 0px, 0px) scale(1, 1)" }
                    : { opacity: 0 }),
                }}
                aria-hidden={index !== activeIndex}
              >
                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center min-h-0 py-2 md:py-4">
                  <TechnologyGroupPanel group={group} index={index} sectionTitle={title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologyStageStatic({ groups, title }: TechnologyStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = groups.length;
  const activeGroup = groups[activeIndex];

  if (!activeGroup) return null;

  const goTo = (index: number) => {
    setActiveIndex((index + count) % count);
  };

  return (
    <section id="technology" className="relative z-10 bg-ink pb-10 pt-24 md:pb-14 md:pt-28">
      <div className="container-edge mx-auto max-w-6xl">
        <h2 className="relative mb-8 w-full text-balance text-center font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium leading-tight text-paper">
          {title}
        </h2>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Previous technology stack"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-paper transition-colors hover:border-signal-soft hover:text-signal-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div key={activeGroup.id}>
              <TechnologyGroupPanel group={activeGroup} index={activeIndex} />
            </div>
          </div>

          <button
            type="button"
            aria-label="Next technology stack"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-paper transition-colors hover:border-signal-soft hover:text-signal-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {groups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              aria-label={`Show ${group.label} stack`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-signal-soft"
                  : "w-2 bg-line-strong hover:bg-paper-faint"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
