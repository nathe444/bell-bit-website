"use client";

import { useEffect, useRef } from "react";
import { services } from "@/lib/content";
import { ScrollTrigger, runScrollTriggerSetup } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { servicesBehavior } from "./services.config";

type Service = (typeof services)[number];

export function ServicesModuleList() {
  const wrapperRef = useRef<HTMLUListElement | null>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const itemCount = services.length;

  useEffect(() => {
    const rows = rowRefs.current;

    if (reducedMotion) {
      rows.forEach((row) => {
        if (row) row.dataset.active = "true";
      });
      return;
    }

    return runScrollTriggerSetup(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top 72%",
        end: "bottom 28%",
        scrub: servicesBehavior.scrubSmoothing,
        onUpdate: (self) => {
          const progress = self.progress;
          rows.forEach((row, index) => {
            if (!row) return;
            const threshold = index / Math.max(1, itemCount - 1);
            row.dataset.active = progress >= threshold - 0.04 ? "true" : "false";
          });
        },
      });

      return () => trigger.kill();
    });
  }, [reducedMotion, itemCount]);

  return (
    <ul
      ref={wrapperRef}
      className="list-none divide-y divide-line border-y border-line p-0"
      aria-label="Services"
    >
      {services.map((service, index) => (
        <ServiceRow
          key={service.id}
          service={service}
          index={index}
          rowRef={(el) => {
            rowRefs.current[index] = el;
          }}
        />
      ))}
    </ul>
  );
}

function ServiceRow({
  service,
  index,
  rowRef,
}: {
  service: Service;
  index: number;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li
      ref={rowRef}
      data-active="false"
      className="group relative py-5 transition-[background-color] duration-300 hover:bg-surface/25 data-[active=true]:bg-surface/20 md:py-6"
    >
      <span
        className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-signal transition-transform duration-500 group-hover:scale-y-100 group-data-[active=true]:scale-y-100"
        aria-hidden="true"
      />

      <div className="flex items-center gap-5 md:gap-7 lg:gap-8">
        <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums tracking-widest text-paper-faint transition-colors duration-300 group-hover:text-signal-soft group-data-[active=true]:text-signal-soft md:text-xs">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-[1.05rem] font-medium leading-[1.25] text-paper-faint transition-colors duration-300 group-hover:text-paper group-data-[active=true]:text-paper md:text-xl lg:text-[1.35rem]">
              {service.title}
            </p>
            <span
              className="shrink-0 font-mono text-sm text-paper-faint opacity-0 transition-[opacity,transform,color] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-data-[active=true]:translate-x-0 group-data-[active=true]:text-signal-soft group-data-[active=true]:opacity-100 -translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
