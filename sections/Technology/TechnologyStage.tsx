"use client";

import { useEffect, useRef, useState } from "react";
import type { technologyGroups as technologyGroupsType } from "@/lib/content";
import { ensureGsapRegistered, gsap, ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
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

/** Exits past the viewer — out of the screen toward you. */
const PANEL_EXIT = {
  opacity: 0,
  scale: 1.14,
  z: 560,
  transformOrigin: "50% 50%",
} as const;

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

  if (reducedMotion) {
    return <TechnologyStageStatic groups={groups} title={title} />;
  }

  return <TechnologyStageMotion groups={groups} title={title} />;
}

function TechnologyStageMotion({ groups, title }: TechnologyStageProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return runScrollTriggerSetup(() => {
      ensureGsapRegistered();
      const pinEl = pinRef.current;
      const headingEl = headingRef.current;
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

      let headingFadeTrigger: ScrollTrigger | undefined;
      if (headingEl) {
        gsap.set(headingEl, { opacity: 1, y: 0 });
        headingFadeTrigger = ScrollTrigger.create({
          trigger: pinEl,
          start: "top 82%",
          end: "top top",
          scrub: scrubSmoothing,
          onUpdate: (self) => {
            gsap.set(headingEl, {
              opacity: 1 - self.progress,
              y: -36 * self.progress,
            });
          },
        });
      }

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

      const lockLastPanel = () => {
        panels.forEach((panel, i) => {
          if (!panel) return;
          if (i === count - 1) {
            gsap.set(panel, { ...PANEL_SETTLED, force3D: false });
          } else {
            gsap.set(panel, { opacity: 0, scale: 1, z: 0, force3D: false });
          }
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${window.innerHeight * tl.duration() * vhPerGroup}`,
        pin: true,
        anticipatePin: 1,
        scrub: scrubSmoothing,
        animation: tl,
        onUpdate: (self) => {
          if (self.progress >= 0.999) {
            lockLastPanel();
          }

          const index = getVisibleIndex(panels);
          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        },
        onLeave: () => {
          tl.progress(1);
          lockLastPanel();
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        headingFadeTrigger?.kill();
        trigger.kill();
        tl.kill();
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length]);

  return (
    <section id="technology" className="relative z-10 bg-ink py-28 md:py-36">
      <div ref={pinRef} className="relative">
        <div className="relative h-[100svh] w-full overflow-hidden">
          <div
            ref={headingRef}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 container-edge mx-auto w-full max-w-6xl pt-6 will-change-[transform,opacity] md:pt-10"
          >
            <div className="pb-8 md:pb-10">
              <h2 className="text-balance text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight text-paper">
                {title}
              </h2>
            </div>
          </div>

          <div
            className="container-edge absolute inset-0 mx-auto flex max-w-6xl items-center justify-center"
            style={{ perspective: "1400px" }}
          >
            {groups.map((group, index) => (
              <div
                key={group.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className="absolute inset-0 flex items-center justify-center will-change-[transform,opacity]"
                style={{
                  transformStyle: "preserve-3d",
                  ...(index === 0
                    ? { opacity: 1, transform: "translate3d(0px, 0px, 0px) scale(1, 1)" }
                    : { opacity: 0 }),
                }}
                aria-hidden={index !== activeIndex}
              >
                <TechnologyGroupPanel group={group} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologyStageStatic({ groups, title }: TechnologyStageProps) {
  return (
    <section id="technology" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge mx-auto max-w-6xl">
        <h2 className="text-balance text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight text-paper">
          {title}
        </h2>
      </div>

      <div className="container-edge mx-auto mt-16 flex max-w-6xl flex-col gap-20 md:mt-24 md:gap-24">
        {groups.map((group, index) => (
          <article key={group.id} className="border-t border-line pt-10">
            <TechnologyGroupPanel group={group} index={index} />
          </article>
        ))}
      </div>
    </section>
  );
}
