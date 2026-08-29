"use client";

import { useEffect, useRef } from "react";
import { services } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ensureGsapRegistered, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Services() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      lineRef.current?.style.setProperty("--line-progress", "1");
      return;
    }
    ensureGsapRegistered();

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      end: "bottom 70%",
      scrub: true,
      onUpdate: (self) => {
        lineRef.current?.style.setProperty("--line-progress", self.progress.toFixed(4));
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="services" className="relative z-10 py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Our Services"
          title="Complexity has a process. This is ours."
          description="Six services, one continuous line of work — from understanding a real problem to running the system that solves it."
        />

        <div ref={sectionRef} className="relative mt-20">
          <div
            ref={lineRef}
            className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line md:block"
            style={{ "--line-progress": 0 } as React.CSSProperties}
          >
            <div
              className="w-full bg-signal"
              style={{
                height: "100%",
                transform: "scaleY(var(--line-progress))",
                transformOrigin: "top",
              }}
            />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {services.map((service, index) => (
              <li key={service.id} className="relative md:pl-12">
                <Reveal delay={index * 0.03}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
                    <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-ink text-xs font-semibold text-signal-soft md:absolute md:-left-1 md:flex">
                      {index + 1}
                    </span>
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-signal-soft md:w-40 md:shrink-0">
                      {service.stage}
                    </span>
                    <div className="max-w-2xl">
                      <h3 className="font-display text-xl font-medium text-paper md:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-paper-dim">{service.description}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
