"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { brandAssets } from "./brand.config";
import { cn } from "@/lib/utils";

type BrandLogoAppearance = "default" | "on-dark-scene";

type BrandLogoProps = {
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
  variant?: "full" | "mark";
  appearance?: BrandLogoAppearance;
  /** @deprecated Use appearance="on-dark-scene" instead. */
  forceInverted?: boolean;
};

function useWhiteLogo(
  appearance: BrandLogoAppearance,
  resolvedTheme: string | undefined,
  mounted: boolean,
  forceInverted?: boolean,
) {
  if (forceInverted || appearance === "on-dark-scene") return true;
  if (!mounted) return true;
  return resolvedTheme === "dark";
}

export function BrandLogo({
  className,
  width,
  height,
  priority,
  variant = "full",
  appearance = "default",
  forceInverted,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const whiteLogo = useWhiteLogo(appearance, resolvedTheme, mounted, forceInverted);
  const toneClass = whiteLogo ? "brightness-0 invert" : "";

  const imgProps = {
    alt: "BellBit",
    width,
    height,
    decoding: "async" as const,
    ...(priority
      ? { fetchPriority: "high" as const, loading: "eager" as const }
      : { loading: "lazy" as const }),
  };

  const fullSrc = whiteLogo ? brandAssets.logoFullMono : brandAssets.logoFullColor;
  const markSrc = brandAssets.logoMark;

  if (variant === "mark") {
    return (
      <span
        className={cn("relative block shrink-0", className)}
        style={{ width: height, height }}
      >
        <img
          {...imgProps}
          src={markSrc}
          className={cn("h-full w-full object-contain object-center", toneClass)}
        />
      </span>
    );
  }

  return (
    <img
      {...imgProps}
      src={fullSrc}
      className={cn("h-auto w-auto object-contain", toneClass, className)}
    />
  );
}
