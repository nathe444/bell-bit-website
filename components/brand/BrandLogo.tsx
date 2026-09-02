"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type BrandLogoProps = {
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
  /** Force white logo — e.g. navbar over the dark hero scene. */
  forceInverted?: boolean;
};

export function BrandLogo({ className, width, height, priority, forceInverted }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const invert = forceInverted || !mounted || resolvedTheme === "dark";

  return (
    <Image
      src="/assets/bellbit/brand/bellbit-logo.png"
      alt="BellBit"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${invert ? "brightness-0 invert" : ""} ${className ?? ""}`}
    />
  );
}
