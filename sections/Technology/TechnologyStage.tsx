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

export function TechnologyStage({ groups }: TechnologyStageProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <TechnologyStageStatic groups={groups} />;
  }

  return <TechnologyStageMotion groups={groups} />;
}

function TechnologyStageMotion({ groups }: TechnologyStageProps) {
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
        vhPerGroup,
        scrubSmoothing,
        enterEase,
        exitEase,
      } = technologyBehavior;

      panels.forEach((panel) => {
        if (!panel) return;
        gsap.set(panel, { ...PANEL_ENTER, force3D: true });
      });

      const tl = gsap.timeline();

      groups.forEach((_, i) => {
        const panel = panels[i];
        if (!panel) return;
        const label = `stack-${i}`;
        tl.addLabel(label);

        tl.fromTo(
          panel,
          { ...PANEL_ENTER },
          {
            ...PANEL_SETTLED,
            duration: enterDuration,
            ease: enterEase,
          },
          label,
        );

        tl.to(panel, { duration: holdDuration }, `${label}+=${enterDuration}`);

        if (i < count - 1) {
          tl.to(
            panel,
            { ...PANEL_EXIT, duration: exitDuration, ease: exitEase },
            `${label}+=${enterDuration + holdDuration}`,
          );
        }
      });

      const trigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${window.innerHeight * count * vhPerGroup}`,
        pin: true,
        anticipatePin: 1,
        scrub: scrubSmoothing,
        animation: tl,
        onUpdate: () => {
          const index = getVisibleIndex(panels);
          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
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
    <div ref={pinRef} className="relative">
      <div className="relative h-[100svh] w-full overflow-hidden">
        <div
          className="container-edge relative mx-auto h-full max-w-6xl py-8 md:py-10"
          style={{ perspective: "1400px" }}
        >
          {groups.map((group, index) => (
            <div
              key={group.id}
              ref={(el) => {
                panelRefs.current[index] = el;
              }}
              className="absolute inset-0 flex items-center will-change-[transform,opacity]"
              style={{ transformStyle: "preserve-3d" }}
              aria-hidden={index !== activeIndex}
            >
              <TechnologyGroupPanel group={group} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnologyStageStatic({ groups }: TechnologyStageProps) {
  return (
    <div className="container-edge mx-auto flex max-w-6xl flex-col gap-20 md:gap-24">
      {groups.map((group, index) => (
        <article key={group.id} className="border-t border-line pt-10">
          <TechnologyGroupPanel group={group} index={index} />
        </article>
      ))}
    </div>
  );
}
