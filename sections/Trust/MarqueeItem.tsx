"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type MarqueeEntry = {
  name: string;
  logo: string | null;
  logoDark?: string | null;
};

function monogram(name: string) {
  const letter = name.trim().charAt(0).toUpperCase();
  return letter || "?";
}

function useDarkTheme() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && resolvedTheme === "dark";
}

type MarqueeItemProps = {
  entry: MarqueeEntry;
};

export function MarqueeItem({ entry }: MarqueeItemProps) {
  const isDark = useDarkTheme();
  const src =
    isDark && entry.logoDark ? entry.logoDark : entry.logo;

  return (
    <div className="flex w-[5.25rem] shrink-0 flex-col items-center gap-2 text-center sm:w-[7.5rem] sm:gap-3 md:w-[10rem] md:gap-4 lg:w-[11rem]">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem]">
        {src ? (
          <div className="relative h-full w-full">
            <Image
              key={src}
              src={src}
              alt=""
              fill
              className="object-contain object-center transition-transform duration-300 group-hover/item:scale-[1.03]"
              sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, 72px"
            />
          </div>
        ) : (
          <span
            className="font-display text-lg font-semibold text-signal sm:text-xl md:text-2xl"
            aria-hidden="true"
          >
            {monogram(entry.name)}
          </span>
        )}
      </div>
      <span className="text-balance text-xs font-medium leading-snug tracking-wide text-paper transition-colors duration-300 group-hover/item:text-signal-soft sm:text-sm md:text-base">
        {entry.name}
      </span>
    </div>
  );
}
