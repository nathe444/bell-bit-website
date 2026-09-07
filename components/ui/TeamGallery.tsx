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
        "relative min-h-[22rem] overflow-hidden rounded-2xl border border-line bg-ink sm:min-h-[26rem] md:min-h-[28rem]",
        className,
      )}
    >
      <div className="relative h-[22rem] sm:h-[26rem] md:h-[28rem]">
        <ThreeDPhotoCarousel items={items} className="h-full" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal-soft">{overlayTitle}</p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-paper md:text-[0.9375rem]">
          {overlayDescription}
        </p>
      </div>
    </div>
  );
}
