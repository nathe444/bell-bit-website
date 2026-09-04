"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  type ICloud,
  renderSimpleIcon,
  type SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#e8ecf4" : "#1a1f2b";
  const fallbackHex = theme === "light" ? "#64748b" : "#9aa3b5";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: MouseEvent) => e.preventDefault(),
    },
  });
};

export type IconCloudProps = {
  iconSlugs: readonly string[];
  className?: string;
  compact?: boolean;
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

function getCloudOptions(compact: boolean) {
  return {
    ...cloudProps.options,
    imageScale: compact ? 1.72 : cloudProps.options.imageScale,
  };
}

export function IconCloud({ iconSlugs, className = "", compact = false }: IconCloudProps) {
  const [data, setData] = useState<IconData | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const slugsKey = iconSlugs.join(",");

  useEffect(() => {
    fetchSimpleIcons({ slugs: [...iconSlugs] }).then(setData);
  }, [slugsKey, iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;

    return Object.values(data.simpleIcons).map((icon) =>
      renderSimpleIcon({
        icon,
        bgHex: theme === "light" ? "#e8ecf4" : "#1a1f2b",
        fallbackHex: theme === "light" ? "#64748b" : "#9aa3b5",
        minContrastRatio: theme === "dark" ? 2 : 1.2,
        size: compact ? 36 : 42,
        aProps: {
          href: undefined,
          target: undefined,
          rel: undefined,
          onClick: (e: MouseEvent) => e.preventDefault(),
        },
      }),
    );
  }, [data, theme, compact]);

  return (
    <div
      className={`relative flex w-full items-center justify-center ${
        compact
          ? "min-h-[220px] sm:min-h-[250px] md:min-h-[280px]"
          : "min-h-[280px] sm:min-h-[320px] md:min-h-[360px]"
      } ${className}`}
      aria-hidden={!data}
    >
      {data ? (
        <Cloud {...cloudProps} options={getCloudOptions(compact)}>
          {renderedIcons}
        </Cloud>
      ) : (
        <div
          className={`w-full animate-pulse rounded-2xl bg-surface/40 ${
            compact ? "h-[220px] sm:h-[250px] md:h-[280px]" : "h-[280px] sm:h-[320px] md:h-[360px]"
          }`}
        />
      )}
    </div>
  );
}
