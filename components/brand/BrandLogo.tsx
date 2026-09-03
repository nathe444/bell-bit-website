"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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

function getLogoToneClass(
  appearance: BrandLogoAppearance,
  resolvedTheme: string | undefined,
  mounted: boolean,
  forceInverted?: boolean,
) {
  if (forceInverted || appearance === "on-dark-scene") {
    return "brightness-0 invert";
  }

  if (!mounted) {
    return "brightness-0 invert";
  }

  return resolvedTheme === "dark" ? "brightness-0 invert" : "";
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

  const toneClass = getLogoToneClass(
    appearance,
    resolvedTheme,
    mounted,
    forceInverted,
  );

  if (variant === "mark") {
    return (
      <span
        className={cn("relative block shrink-0 overflow-hidden", className)}
        style={{ width: height, height }}
        aria-hidden={false}
      >
        <Image
          src="/assets/bellbit/brand/bellbit-logo.png"
          alt="BellBit"
          width={width}
          height={height}
          priority={priority}
          className={cn(
            "absolute left-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-left object-contain",
            toneClass,
          )}
        />
      </span>
    );
  }

  return (
    <Image
      src="/assets/bellbit/brand/bellbit-logo.png"
      alt="BellBit"
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain", toneClass, className)}
    />
  );
}
