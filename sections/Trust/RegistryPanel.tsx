"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/animations/gsap";
import { runScrollTriggerSetup, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RegistryPanelProps = {
  children: ReactNode;
};

/** Orchestrated row entrance — one trigger, subtle stagger, no per-row Reveal. */
export function RegistryPanel({ children }: RegistryPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || reducedMotion) return;

    return runScrollTriggerSetup(() => {
      const rows = panel.querySelectorAll<HTMLElement>(".registry-row");

      gsap.set(rows, { opacity: 0, y: 10 });

      const trigger = ScrollTrigger.create({
        trigger: panel,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: "power2.out",
          });
        },
      });

      return () => trigger.kill();
    });
  }, [reducedMotion]);

  return (
    <div ref={panelRef} className={reducedMotion ? undefined : "registry-panel"}>
      {children}
    </div>
  );
}
