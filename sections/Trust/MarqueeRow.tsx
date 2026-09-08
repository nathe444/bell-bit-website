"use client";

import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MarqueeItem, type MarqueeEntry } from "./MarqueeItem";

type MarqueeRowProps = {
  label: string;
  directionLabel: string;
  entries: readonly MarqueeEntry[];
  direction: "left" | "right";
  durationSeconds: number;
  /** Repeat entries until each loop segment has at least this many items. */
  minItemsPerSegment?: number;
};

function buildMarqueeSegment(
  entries: readonly MarqueeEntry[],
  minItemsPerSegment?: number,
): MarqueeEntry[] {
  if (entries.length === 0) return [];

  const target = Math.max(entries.length, minItemsPerSegment ?? entries.length);
  const segment: MarqueeEntry[] = [];

  for (let i = 0; i < target; i += 1) {
    segment.push(entries[i % entries.length]!);
  }

  return segment;
}

function ItemList({
  entries,
  listKey,
  duplicate = false,
}: {
  entries: readonly MarqueeEntry[];
  listKey: string;
  duplicate?: boolean;
}) {
  return (
    <ul className="flex items-start" aria-hidden={duplicate || undefined}>
      {entries.map((entry, index) => (
        <li
          key={`${listKey}-${entry.name}-${index}${duplicate ? "-dup" : ""}`}
          className="group/item px-2.5 sm:px-7 md:px-10 lg:px-12"
        >
          <MarqueeItem entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export function MarqueeRow({
  label,
  directionLabel,
  entries,
  direction,
  durationSeconds,
  minItemsPerSegment,
}: MarqueeRowProps) {
  const reducedMotion = useReducedMotion();
  const segment = useMemo(
    () => buildMarqueeSegment(entries, minItemsPerSegment),
    [entries, minItemsPerSegment],
  );

  if (reducedMotion) {
    return (
      <div className="py-4 md:py-10">
        <RowHeader label={label} directionLabel={directionLabel} />
        <ul className="mx-auto mt-5 flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-6 sm:mt-8 sm:gap-x-8 sm:gap-y-10 md:gap-x-12 md:gap-y-12">
          {entries.map((entry) => (
            <li key={entry.name} className="group/item">
              <MarqueeItem entry={entry} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="marquee-row py-4 md:py-10">
      <RowHeader label={label} directionLabel={directionLabel} />
      <div className="marquee-fade relative mx-auto mt-5 w-[90%] overflow-hidden sm:mt-8 md:mt-10">
        <div
          className={`marquee-track flex w-max will-change-transform ${animationClass}`}
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          <ItemList entries={segment} listKey="a" />
          <ItemList entries={segment} listKey="b" duplicate />
        </div>
      </div>
    </div>
  );
}

function RowHeader({ label, directionLabel }: { label: string; directionLabel: string }) {
  return (
    <div className="container-edge text-center">
      <p className="font-mono text-xs uppercase tracking-[0.45em] text-paper-faint md:text-sm">
        {label}
      </p>
      <span
        className="mt-2 block font-mono text-sm tracking-[0.35em] text-signal-soft/45 md:text-base"
        aria-hidden="true"
      >
        {directionLabel}
      </span>
    </div>
  );
}
