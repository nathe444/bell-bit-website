"use client";

import { useEffect, useRef } from "react";
import type { architectureStages as stagesType } from "@/lib/content";
import { ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { architectureBehavior, architectureRegistryId } from "./architecture.config";

type Stage = (typeof stagesType)[number];

type ArchitecturePipelineProps = {
  stages: readonly Stage[];
};

export function ArchitecturePipeline({ stages }: ArchitecturePipelineProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lineFillRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const rows = rowRefs.current;
    const stageCount = stages.length;

    if (reducedMotion) {
      lineFillRef.current?.style.setProperty("transform", "scaleY(1)");
      rows.forEach((row) => {
        if (row) row.dataset.active = "true";
      });
      return;
    }

    return runScrollTriggerSetup(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top 70%",
        end: "bottom 35%",
        scrub: architectureBehavior.scrubSmoothing,
        onUpdate: (self) => {
          const progress = self.progress;
          lineFillRef.current?.style.setProperty("transform", `scaleY(${progress})`);

          rows.forEach((row, index) => {
            if (!row) return;
            const threshold = index / Math.max(1, stageCount - 1);
            const active = progress >= threshold - 0.03;
            row.dataset.active = active ? "true" : "false";
          });
        },
      });

      return () => trigger.kill();
    });
  }, [reducedMotion, stages.length]);

  return (
    <div ref={wrapperRef} className="relative mt-16 md:mt-20">
      {/* Progress spine */}
      <div
        className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-line md:left-[2.625rem]"
        aria-hidden="true"
      >
        <div
          ref={lineFillRef}
          className="h-full w-full origin-top bg-signal will-change-transform"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      <ol className="relative m-0 list-none p-0">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className="group border-b border-line border-l-2 border-l-transparent py-8 pl-10 transition-[border-color,background-color] duration-300 data-[active=true]:border-l-signal data-[active=true]:bg-surface/40 md:grid md:grid-cols-[5.5rem_11rem_1fr] md:items-start md:gap-x-8 md:py-10 md:pl-16"
            data-active="false"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint md:text-xs">
              {architectureRegistryId(index)}
            </span>

            <h3 className="mt-2 font-display text-lg font-medium text-paper-faint transition-colors duration-300 group-data-[active=true]:text-paper md:mt-0 md:text-xl">
              {stage.label}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-paper-faint transition-colors duration-300 group-data-[active=true]:text-paper-dim md:col-span-1 md:mt-0 md:text-base">
              {stage.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
