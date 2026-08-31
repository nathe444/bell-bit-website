"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { projects as projectsType } from "@/lib/content";
import { ensureGsapRegistered, gsap, ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Project = (typeof projectsType)[number];

type ProjectStageProps = {
  projects: readonly Project[];
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** How much scroll (in viewport-heights) is given to each project's full enter/hold/exit cycle. */
const VH_PER_PROJECT = 1.6;

export function ProjectStage({ projects }: ProjectStageProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <ProjectStageStatic projects={projects} />;
  }

  return <ProjectStageMotion projects={projects} />;
}

/**
 * The reveal itself: each project sits off to the left — smaller, dimmer,
 * blurred, rotated slightly away — then travels toward center while moving
 * forward in depth (scale + z) and sharpening into focus, overshooting its
 * final position before settling (GSAP's `back.out` ease bakes the overshoot
 * directly into the eased curve, so it reads correctly even though the whole
 * thing is scrubbed 1:1 by scroll position, not autoplaying on a clock).
 * Once "held" as the featured project, it's pushed away to make room for the
 * next one entering the same way — a presentation, not a carousel.
 */
function ProjectStageMotion({ projects }: ProjectStageProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const indexLabelRef = useRef<HTMLSpanElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return runScrollTriggerSetup(() => {
      ensureGsapRegistered();
      const pinEl = pinRef.current;
      if (!pinEl) return;

      const count = projects.length;
      const cards = cardRefs.current;

    cards.forEach((card) => {
      if (!card) return;
      gsap.set(card, {
        xPercent: -68,
        scale: 0.82,
        opacity: 0,
        rotateY: -10,
        z: -280,
        filter: "blur(16px)",
        force3D: true,
      });
    });

    const tl = gsap.timeline();
    const labelTimes: number[] = [];

    projects.forEach((_, i) => {
      const card = cards[i];
      if (!card) return;
      const label = `project-${i}`;
      tl.addLabel(label);
      labelTimes.push(tl.time());

      // Enter: lateral travel from left + forward in depth + scale up +
      // sharpen + brighten + settle out of the rotation, with a subtle
      // overshoot past the resting position baked into the ease itself.
      tl.fromTo(
        card,
        { xPercent: -68, scale: 0.82, opacity: 0, rotateY: -10, z: -280, filter: "blur(16px)" },
        {
          xPercent: 0,
          scale: 1,
          opacity: 1,
          rotateY: 0,
          z: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "back.out(1.4)",
        },
        label
      );

      // Hold: the featured moment — enough scroll room to actually read it.
      tl.to(card, { duration: 0.55 }, `${label}+=1`);

      // Exit: give way to the next project, mirroring the entry but reversed
      // and pushed off to the right so it never feels like it retraces its path.
      if (i < count - 1) {
        tl.to(
          card,
          {
            xPercent: 46,
            scale: 0.86,
            opacity: 0,
            rotateY: 8,
            z: -180,
            filter: "blur(10px)",
            duration: 0.65,
            ease: "power2.inOut",
          },
          `${label}+=1.55`
        );
      }
    });

    const totalDuration = tl.duration();

    const setActive = (index: number, progress: number) => {
      if (indexLabelRef.current) indexLabelRef.current.textContent = pad(index + 1);
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${Math.min(1, Math.max(0, progress)) * 100}%`;
      }
    };

    setActive(0, 0);

    const trigger = ScrollTrigger.create({
      trigger: pinEl,
      start: "top top",
      end: () => `+=${window.innerHeight * count * VH_PER_PROJECT}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.7,
      animation: tl,
      onUpdate: (self) => {
        const t = self.progress * totalDuration;
        let index = 0;
        for (let i = labelTimes.length - 1; i >= 0; i--) {
          if (t >= labelTimes[i] - 0.001) {
            index = i;
            break;
          }
        }
        setActive(index, self.progress);
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  return (
    <div ref={pinRef} className="relative">
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ perspective: "1600px" }}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute inset-0 flex items-center justify-center px-6 md:px-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform, filter, opacity" }}
          >
            <div className="grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
              <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
                <div
                  className={`relative w-full ${
                    project.imageOrientation === "portrait"
                      ? "aspect-[9/16] max-w-xs mx-auto"
                      : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} interface screenshot`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm text-paper-faint">{pad(index + 1)}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-signal-soft">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-medium text-paper md:text-4xl">
                  {project.name}
                </h3>
                <p className="mt-4 text-lg text-paper-dim">{project.summary}</p>
                <p className="mt-3 text-paper-faint">{project.detail}</p>
                <span className="mt-6 inline-block rounded-full border border-line px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-paper-dim">
                  {project.industry}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center gap-4">
          <span ref={indexLabelRef} className="font-display text-sm text-paper-faint">
            {pad(1)}
          </span>
          <div className="h-px w-32 overflow-hidden rounded-full bg-line">
            <div ref={progressFillRef} className="h-full bg-signal" style={{ width: 0 }} />
          </div>
          <span className="font-display text-sm text-paper-faint">{pad(projects.length)}</span>
        </div>
      </div>
    </div>
  );
}

/** prefers-reduced-motion: the same case studies, laid out plainly with no scroll-jacking or motion. */
function ProjectStageStatic({ projects }: ProjectStageProps) {
  return (
    <div className="flex flex-col gap-20">
      {projects.map((project, index) => (
        <article
          key={project.id}
          className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14"
        >
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
            <div
              className={`relative w-full ${
                project.imageOrientation === "portrait"
                  ? "aspect-[9/16] max-w-xs mx-auto"
                  : "aspect-[16/10]"
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.name} interface screenshot`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm text-paper-faint">{pad(index + 1)}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-signal-soft">
                {project.category}
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-medium text-paper md:text-4xl">
              {project.name}
            </h3>
            <p className="mt-4 text-lg text-paper-dim">{project.summary}</p>
            <p className="mt-3 text-paper-faint">{project.detail}</p>
            <span className="mt-6 inline-block rounded-full border border-line px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-paper-dim">
              {project.industry}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
