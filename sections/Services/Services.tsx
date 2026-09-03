"use client";

import { servicesGlobe, servicesSection } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Globe } from "@/components/ui/Globe";
import { ServicesModuleList } from "./ServicesModuleList";

export function Services() {
  return (
    <section id="services" className="relative z-10 bg-void py-20 md:py-28">
      <div className="container-edge">
        <Reveal>
          <div className="border-b border-line pb-6 md:pb-8">
            <h2 className="max-w-3xl text-balance font-display text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.02] text-paper">
              {servicesSection.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-8 grid items-center gap-10 md:mt-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <Reveal delay={0.04}>
            <ServicesModuleList />
          </Reveal>

          <Reveal
            delay={0.08}
            className="flex items-center justify-center md:sticky md:top-[calc(50vh-12rem)] md:self-center"
          >
            <Globe
              markers={[...servicesGlobe.markers]}
              arcs={[...servicesGlobe.arcs]}
              className="mx-auto w-full max-w-[min(100%,360px)] sm:max-w-[min(100%,420px)] md:max-w-[min(100%,440px)] lg:max-w-[min(100%,520px)] xl:max-w-[min(100%,580px)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
