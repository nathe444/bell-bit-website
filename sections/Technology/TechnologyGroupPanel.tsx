"use client";

import { IconCloud } from "@/components/ui/IconCloud";
import type { TechnologyGroup } from "@/lib/content";

type TechnologyGroupPanelProps = {
  group: TechnologyGroup;
  index: number;
  sectionTitle?: string;
};

export function TechnologyGroupPanel({ group, index, sectionTitle }: TechnologyGroupPanelProps) {
  const cloudFirst = index % 2 === 0;

  return (
    <div className="flex w-full max-w-6xl flex-col items-center">
      {sectionTitle ? (
        <h2 className="relative mb-8 w-full -translate-y-3 text-balance text-center font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium leading-tight text-paper md:mb-10 md:-translate-y-10">
          {sectionTitle}
        </h2>
      ) : null}

      <div className="grid w-full grid-cols-1 items-center gap-y-6 max-md:gap-y-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-12 md:gap-y-8 lg:gap-x-16">
        <div className={`min-w-0 ${cloudFirst ? "md:order-1" : "md:order-2"}`}>
          <IconCloud
            iconSlugs={group.iconSlugs}
            compact
            className="mx-auto w-full max-w-[min(100%,300px)] sm:max-w-[340px] md:mx-0 md:max-w-[380px]"
          />
        </div>

        <div className={`min-w-0 max-md:text-center ${cloudFirst ? "md:order-2" : "md:order-1"}`}>
          <p className="font-display text-xl font-medium leading-tight text-signal-soft max-md:text-balance sm:text-2xl md:text-left md:text-3xl lg:text-4xl">
            {group.label}
          </p>
          <h3 className="mt-2 font-display text-sm font-medium leading-snug text-paper max-md:text-balance sm:text-base md:text-left md:text-lg lg:text-xl">
            {group.title}
          </h3>
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5 max-md:gap-2 md:mt-6 md:justify-start md:gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line-strong bg-surface/50 px-2.5 py-1 text-[11px] font-medium text-paper-dim sm:px-3 sm:text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
