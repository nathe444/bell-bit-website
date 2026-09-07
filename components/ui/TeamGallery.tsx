"use client";

import { useMemo } from "react";
import { ThreeDPhotoCarousel, type CarouselItem } from "@/components/ui/ThreeDPhotoCarousel";
import { cn } from "@/lib/utils";

type TeamGalleryProps = {
  heroImage: { src: string; alt: string; aspectRatio: string };
  photos: readonly { id: string; src: string; alt: string; aspectRatio: string }[];
  overlayTitle: string;
  overlayDescription: string;
  className?: string;
};

export function TeamGallery({
  heroImage,
  photos,
  overlayTitle,
  overlayDescription,
  className,
}: TeamGalleryProps) {
  const items = useMemo<CarouselItem[]>(
    () => [
      {
        kind: "image",
        id: "team-hero",
        src: heroImage.src,
        alt: heroImage.alt,
        aspectRatio: heroImage.aspectRatio,
      },
      ...photos.map((photo) => ({
        kind: "image" as const,
        id: photo.id,
        src: photo.src,
        alt: photo.alt,
        aspectRatio: photo.aspectRatio,
      })),
    ],
    [heroImage.alt, heroImage.src, photos],
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-ink md:min-h-[28rem]",
        className,
      )}
    >
      <div className="relative h-[12.5rem] sm:h-[26rem] md:h-[28rem]">
        <ThreeDPhotoCarousel items={items} className="h-full" />
      </div>

      <div className="border-t border-line/60 p-5 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:border-t-0 md:bg-gradient-to-t md:from-ink md:via-ink/95 md:to-transparent md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal-soft">{overlayTitle}</p>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-paper md:mt-3 md:text-[0.9375rem]">
          {overlayDescription}
        </p>
      </div>
    </div>
  );
}
