"use client";

import { services, servicesGlobe, servicesSection } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Globe } from "@/components/ui/Globe";

export function Services() {
  return (
    <section id="services" className="relative z-10 bg-void py-20 md:py-24">
      <div className="container-edge grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
        <div>
          <SectionHeading
            eyebrow={servicesSection.eyebrow}
            title={servicesSection.title}
            description={servicesSection.description}
          />

          <ul className="mt-8 divide-y divide-line border-y border-line md:mt-10">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.02}>
                <li className="flex items-baseline gap-4 py-3 md:py-3.5">
                  <span className="shrink-0 font-mono text-[10px] tracking-wider text-paper-faint md:text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-snug text-paper md:text-[0.9375rem]">
                    {service.title}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.08} className="flex justify-center lg:justify-end">
          <Globe
            markers={[...servicesGlobe.markers]}
            arcs={[...servicesGlobe.arcs]}
            className="mx-auto max-w-[min(100%,580px)] lg:mr-0 lg:max-w-[min(100%,640px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
