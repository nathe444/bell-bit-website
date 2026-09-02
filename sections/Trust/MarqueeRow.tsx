"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MarqueeItem, type MarqueeEntry } from "./MarqueeItem";

type MarqueeRowProps = {
  label: string;
  directionLabel: string;
  entries: readonly MarqueeEntry[];
  direction: "left" | "right";
  durationSeconds: number;
};

function ItemList({
  entries,
  duplicate = false,
}: {
  entries: readonly MarqueeEntry[];
  duplicate?: boolean;
}) {
  return (
    <ul className="flex items-start" aria-hidden={duplicate || undefined}>
      {entries.map((entry) => (
        <li
          key={`${entry.name}${duplicate ? "-dup" : ""}`}
          className="group/item px-5 sm:px-7 md:px-10 lg:px-12"
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
}: MarqueeRowProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="py-8 md:py-10">
        <RowHeader label={label} directionLabel={directionLabel} />
        <ul className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-12">
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
    <div className="marquee-row py-8 md:py-10">
      <RowHeader label={label} directionLabel={directionLabel} />
      <div className="marquee-fade relative mx-auto mt-8 w-[90%] overflow-hidden md:mt-10">
        <div
          className={`marquee-track flex w-max will-change-transform ${animationClass}`}
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          <ItemList entries={entries} />
          <ItemList entries={entries} duplicate />
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
