"use client";

import { IconCloud } from "@/components/ui/IconCloud";
import type { TechnologyGroup } from "@/lib/content";
import { technologyGroupId } from "./technology.config";

type TechnologyGroupPanelProps = {
  group: TechnologyGroup;
  index: number;
};

export function TechnologyGroupPanel({ group, index }: TechnologyGroupPanelProps) {
  const cloudFirst = index % 2 === 0;

  return (
    <div className="grid w-full grid-cols-1 items-center gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-16 lg:gap-x-20">
      <div className={`min-w-0 ${cloudFirst ? "md:order-1" : "md:order-2"}`}>
        <IconCloud
          iconSlugs={group.iconSlugs}
          className="mx-auto min-h-[260px] w-full max-w-[420px] sm:min-h-[300px] md:mx-0 md:max-w-none md:min-h-[340px]"
        />
      </div>

      <div className={`min-w-0 ${cloudFirst ? "md:order-2" : "md:order-1"}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-signal-soft md:text-xs">
          {technologyGroupId(index)} — {group.label}
        </p>
        <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-paper md:text-3xl lg:text-[2rem]">
          {group.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-paper-dim md:text-lg">
          {group.description}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {group.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line-strong bg-surface/50 px-3 py-1 text-xs font-medium text-paper-dim"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
