"use client";

import { useEffect, useRef, useState } from "react";
import type { projects as projectsType } from "@/lib/content";
import { ensureGsapRegistered, gsap, ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectDossier } from "./ProjectDossier";
import { ProjectIndexRail } from "./ProjectIndexRail";
import { projectBehavior, projectRegistryId } from "./project.config";

type Project = (typeof projectsType)[number];

type ProjectStageProps = {
  projects: readonly Project[];
};

export function ProjectStage({ projects }: ProjectStageProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <ProjectStageStatic projects={projects} />;
  }

  return <ProjectStageMotion projects={projects} />;
}

/** Pick the dossier with the highest rendered opacity — stays in sync with crossfades. */
function getVisibleIndex(dossiers: Array<HTMLDivElement | null>) {
  let bestIndex = 0;
  let bestOpacity = -1;
  dossiers.forEach((el, i) => {
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

/** Scroll-pinned case dossiers — opacity and y only, synced with Lenis scrub. */
function ProjectStageMotion({ projects }: ProjectStageProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const dossierRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return runScrollTriggerSetup(() => {
      ensureGsapRegistered();
      const pinEl = pinRef.current;
      if (!pinEl) return;

      const count = projects.length;
      const dossiers = dossierRefs.current;
      const { enterDuration, holdDuration, exitDuration, vhPerProject, scrubSmoothing } =
        projectBehavior;

      dossiers.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 24, force3D: true });
      });

      const tl = gsap.timeline();

      projects.forEach((_, i) => {
        const el = dossiers[i];
        if (!el) return;
        const label = `project-${i}`;
        tl.addLabel(label);

        tl.fromTo(
          el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: enterDuration, ease: "power2.out" },
          label
        );

        tl.to(el, { duration: holdDuration }, `${label}+=${enterDuration}`);

        if (i < count - 1) {
          tl.to(
            el,
            { opacity: 0, y: -16, duration: exitDuration, ease: "power2.in" },
            `${label}+=${enterDuration + holdDuration}`
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
          const index = getVisibleIndex(dossiers);
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
        <div className="container-edge flex h-full flex-col py-8 md:grid md:grid-cols-[minmax(0,0.22fr)_minmax(0,0.78fr)] md:gap-8 md:py-10 lg:gap-12">
          <ProjectIndexRail
            projects={projects}
            activeIndex={activeIndex}
            progressFillRef={progressFillRef}
          />

          <div className="relative min-h-0 flex-1 md:min-h-[520px]">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => {
                  dossierRefs.current[index] = el;
                }}
                className="absolute inset-0 flex items-center will-change-[transform,opacity]"
                aria-hidden={index !== activeIndex}
              >
                <ProjectDossier project={project} index={index} className="w-full" />
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
    <div className="container-edge flex flex-col gap-24 md:gap-28">
      {projects.map((project, index) => (
        <article key={project.id} className="border-t border-line pt-10">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-paper-faint">
            {projectRegistryId(index)}
          </p>
          <ProjectDossier project={project} index={index} />
        </article>
      ))}
    </div>
  );
}
