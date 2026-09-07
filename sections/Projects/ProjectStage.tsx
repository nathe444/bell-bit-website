"use client";

import { useEffect, useRef, useState } from "react";
import type { projects as projectsType } from "@/lib/content";
import { ensureGsapRegistered, gsap, ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectDossier } from "./ProjectDossier";
import { ProjectIndexRail } from "./ProjectIndexRail";
import { projectBehavior } from "./project.config";

type Project = (typeof projectsType)[number];

type ProjectStageProps = {
  projects: readonly Project[];
};

const CLAIM_ENTER = {
  opacity: 0,
  scale: 0.52,
  rotateY: -22,
  z: -520,
  transformOrigin: "50% 50%",
} as const;

const CLAIM_SETTLED = {
  opacity: 1,
  scale: 1,
  rotateY: 0,
  z: 0,
} as const;

const CLAIM_EXIT = {
  opacity: 0,
  scale: 0.76,
  rotateY: 20,
  z: -380,
} as const;

/** Pick the dossier with the highest rendered opacity — stays in sync with crossfades. */
function getVisibleIndex(cards: Array<HTMLDivElement | null>) {
  let bestIndex = 0;
  let bestOpacity = -1;
  cards.forEach((el, i) => {
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

export function ProjectStage({ projects }: ProjectStageProps) {
  const reducedMotion = useReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  if (reducedMotion || isSmallScreen) {
    return <ProjectStageStatic projects={projects} />;
  }

  return <ProjectStageMotion projects={projects} />;
}

/** Scroll-pinned case dossiers — battle-pass claim pop, scrubbed by scroll. */
function ProjectStageMotion({ projects }: ProjectStageProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return runScrollTriggerSetup(() => {
      ensureGsapRegistered();
      const pinEl = pinRef.current;
      if (!pinEl) return;

      const count = projects.length;
      const cards = cardRefs.current;
      const shines = shineRefs.current;
      const {
        enterDuration,
        holdDuration,
        exitDuration,
        vhPerProject,
        scrubSmoothing,
        claimEase,
        claimExitEase,
      } = projectBehavior;

      cards.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          ...(i === 0 ? CLAIM_SETTLED : CLAIM_ENTER),
          force3D: true,
        });
        const shine = shines[i];
        if (shine) gsap.set(shine, { xPercent: -130, opacity: 0 });
      });

      const tl = gsap.timeline();

      projects.forEach((_, i) => {
        const card = cards[i];
        if (!card) return;
        const shine = shines[i];
        const label = `project-${i}`;
        tl.addLabel(label);

        if (i === 0) {
          tl.to(card, { duration: holdDuration }, label);
        } else {
          // Claim pop — scale overshoot, 3D tilt forward, brightness snap
          tl.fromTo(
            card,
            { ...CLAIM_ENTER },
            {
              ...CLAIM_SETTLED,
              duration: enterDuration,
              ease: claimEase,
            },
            label
          );

          if (shine) {
            tl.fromTo(
              shine,
              { xPercent: -130, opacity: 0 },
              { xPercent: 230, opacity: 0.9, duration: enterDuration * 0.85, ease: "power2.out" },
              label
            );
            tl.to(shine, { opacity: 0, duration: enterDuration * 0.15 }, `${label}+=${enterDuration * 0.7}`);
          }

          tl.to(card, { duration: holdDuration }, `${label}+=${enterDuration}`);
        }

        if (i < count - 1) {
          tl.to(
            card,
            { ...CLAIM_EXIT, duration: exitDuration, ease: claimExitEase },
            `${label}+=${i === 0 ? holdDuration : enterDuration + holdDuration}`
          );
        }
      });

      const trigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${window.innerHeight * count * vhPerProject}`,
        pin: true,
        anticipatePin: 1,
        scrub: scrubSmoothing,
        animation: tl,
        onUpdate: (self) => {
          const index = getVisibleIndex(cards);
          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
          progressFillRef.current?.style.setProperty(
            "transform",
            `scaleX(${Math.min(1, Math.max(0, self.progress))})`
          );
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
  }, [projects.length]);

  return (
    <div ref={pinRef} className="relative">
      <div className="relative flex h-screen w-full flex-col overflow-hidden md:block">
        <div className="container-edge grid h-full flex-col py-8 md:grid-cols-[minmax(0,0.22fr)_minmax(0,0.78fr)] md:items-stretch md:gap-8 md:py-10 lg:gap-12">
          <ProjectIndexRail
            projects={projects}
            activeIndex={activeIndex}
            progressFillRef={progressFillRef}
          />

          <div
            className="relative min-h-0 flex-1 md:min-h-[520px]"
            style={{ perspective: "1400px" }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="pointer-events-none absolute inset-0 flex items-center justify-center md:pointer-events-auto"
                aria-hidden={index !== activeIndex}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="relative z-10 w-full will-change-[transform,opacity]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Shine sweep — battle pass claim flash */}
                  <div
                    ref={(el) => {
                      shineRefs.current[index] = el;
                    }}
                    className="pointer-events-none absolute -inset-y-6 z-30 w-2/5 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent will-change-transform"
                    aria-hidden="true"
                  />

                  <ProjectDossier project={project} index={index} className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** prefers-reduced-motion: vertical dossier stack, no scroll-jacking. */
function ProjectStageStatic({ projects }: ProjectStageProps) {
  return (
    <div className="container-edge flex min-w-0 flex-col gap-14 overflow-x-hidden md:gap-28">
      {projects.map((project, index) => (
        <article key={project.id} className="border-t border-line pt-8 md:pt-10">
          <ProjectDossier project={project} index={index} />
        </article>
      ))}
    </div>
  );
}
