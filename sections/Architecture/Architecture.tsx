"use client";

import { useEffect, useRef } from "react";
import { architectureStages } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ensureGsapRegistered, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Architecture() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const stageCount = architectureStages.length;

    if (reducedMotion) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      nodeRefs.current.forEach((node) => {
        node?.setAttribute("fill", "var(--color-signal)");
        node?.setAttribute("r", "7");
      });
      return;
    }
    ensureGsapRegistered();

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top 55%",
      end: "bottom 65%",
      scrub: true,
      onUpdate: (self) => {
        path.style.strokeDashoffset = `${length * (1 - self.progress)}`;
        nodeRefs.current.forEach((node, index) => {
          if (!node) return;
          const threshold = index / (stageCount - 1);
          const active = self.progress >= threshold - 0.02;
          node.setAttribute("fill", active ? "var(--color-signal)" : "var(--color-surface-raised)");
          node.setAttribute("r", active ? "7" : "5.5");
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  const stageCount = architectureStages.length;

  return (
    <section
      id="architecture"
      className="relative z-10 overflow-hidden bg-void py-28 md:py-36"
      style={{
        backgroundImage:
          "radial-gradient(rgba(226,232,245,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="container-edge">
        <SectionHeading
          eyebrow="Architectural Advancement"
          title="A problem becomes a system through a fixed sequence of decisions."
          description="This is the level BellBit works at: not just writing code, but deciding how a system is structured before a line of it exists."
        />

        <div ref={wrapperRef} className="relative mt-20">
          {/* Desktop: horizontal SVG-connected diagram */}
          <div className="hidden md:block">
            <svg
              viewBox={`0 0 ${100 * (stageCount - 1)} 40`}
              preserveAspectRatio="none"
              className="h-16 w-full"
              aria-hidden="true"
            >
              <path
                d={`M 0 20 ${architectureStages
                  .map((_, i) => `L ${i * 100} 20`)
                  .join(" ")}`}
                stroke="var(--color-line-strong)"
                strokeWidth={1}
                fill="none"
              />
              <path
                ref={pathRef}
                d={`M 0 20 ${architectureStages
                  .map((_, i) => `L ${i * 100} 20`)
                  .join(" ")}`}
                stroke="var(--color-signal)"
                strokeWidth={1.5}
                fill="none"
              />
              {architectureStages.map((stage, index) => (
                <circle
                  key={stage.id}
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  cx={index * 100}
                  cy={20}
                  r={5.5}
                  fill="var(--color-surface-raised)"
                  stroke="var(--color-line-strong)"
                />
              ))}
            </svg>

            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: `repeat(${stageCount}, minmax(0, 1fr))` }}
            >
              {architectureStages.map((stage, index) => (
                <Reveal key={stage.id} delay={index * 0.03}>
                  <div>
                    <h3 className="font-display text-lg font-medium text-paper">
                      {stage.label}
                    </h3>
                    <p className="mt-2 text-sm text-paper-dim">{stage.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stack */}
          <ol className="space-y-10 md:hidden">
            {architectureStages.map((stage, index) => (
              <Reveal key={stage.id} delay={index * 0.03}>
                <li className="border-l-2 border-line-strong pl-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-signal-soft">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-paper">
                    {stage.label}
                  </h3>
                  <p className="mt-1 text-sm text-paper-dim">{stage.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
