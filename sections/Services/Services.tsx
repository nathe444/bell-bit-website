"use client";

import { servicesGlobe, servicesSection } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Globe } from "@/components/ui/Globe";
import { ServicesModuleList } from "./ServicesModuleList";

export function Services() {
  return (
    <section
      id="services"
      className="relative z-10 bg-void py-16 md:flex md:min-h-[100svh] md:items-center md:py-10 lg:py-12"
    >
      <div className="container-edge w-full">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,52%)_minmax(0,48%)] md:gap-6 lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 md:gap-8 lg:gap-10">
            <Reveal>
              <h2 className="text-balance font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] text-paper">
                {servicesSection.title}
              </h2>
            </Reveal>

            <Reveal delay={0.04}>
              <ServicesModuleList />
            </Reveal>
          </div>

          <Reveal
            delay={0.08}
            className="flex items-center justify-center md:self-center"
          >
            <Globe
              markers={[...servicesGlobe.markers]}
              arcs={[...servicesGlobe.arcs]}
              className="mx-auto w-full max-w-[min(100%,360px)] sm:max-w-[min(100%,380px)] md:max-w-[min(100%,400px)] lg:max-w-[min(100%,460px)] xl:max-w-[min(100%,500px)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
