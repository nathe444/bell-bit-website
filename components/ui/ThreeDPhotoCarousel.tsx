"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Founder } from "@/lib/content";
import { cn } from "@/lib/utils";

export type CarouselImageItem = {
  kind: "image";
  id: string;
  src: string;
  alt: string;
};

export type CarouselFounderItem = {
  kind: "founder";
  id: string;
  founder: Founder;
};

export type CarouselItem = CarouselImageItem | CarouselFounderItem;

const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const };

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

function FounderFace({ founder }: { founder: Founder }) {
  const isCeo = founder.role === "CEO";

  return (
    <div
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center",
        isCeo ? "border-signal/30 bg-signal text-on-signal" : "border-line bg-surface-raised text-paper",
      )}
    >
      <span className="font-display text-3xl font-semibold tracking-tight">{getInitials(founder.name)}</span>
      <div className="min-w-0 w-full px-1">
        <p className="truncate text-sm font-medium">{founder.name}</p>
        <p className={cn("text-[0.65rem] uppercase tracking-[0.14em]", isCeo ? "text-on-signal/80" : "text-paper-faint")}>
          {founder.role}
        </p>
      </div>
    </div>
  );
}

const AUTO_ROTATE_DEG_PER_SEC = 10;

const Carousel = memo(function Carousel({
  items,
  isCarouselActive,
  onImageClick,
}: {
  items: CarouselItem[];
  isCarouselActive: boolean;
  onImageClick: (src: string) => void;
}) {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
  const cylinderWidth = isScreenSizeSm ? 900 : 1400;
  const faceCount = items.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);
  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isCarouselActive) return;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (isDraggingRef.current) {
        lastTime = now;
        return;
      }

      const delta = (now - lastTime) / 1000;
      lastTime = now;
      rotation.set(rotation.get() + AUTO_ROTATE_DEG_PER_SEC * delta);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isCarouselActive, rotation]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        drag={isCarouselActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDrag={(_, info) => {
          if (isCarouselActive) {
            rotation.set(rotation.get() + info.delta.x * 0.05);
          }
        }}
        onDragEnd={(_, info) => {
          isDraggingRef.current = false;
          if (isCarouselActive) {
            rotation.set(rotation.get() + info.velocity.x * 0.05);
          }
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="absolute flex h-full origin-center items-center justify-center p-1.5 sm:p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
            }}
          >
            {item.kind === "image" ? (
              <button
                type="button"
                onClick={() => onImageClick(item.src)}
                className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 140px, 200px"
                  draggable={false}
                />
              </button>
            ) : (
              <div className="w-full">
                <FounderFace founder={item.founder} />
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
});

type ThreeDPhotoCarouselProps = {
  items: CarouselItem[];
  className?: string;
};

export function ThreeDPhotoCarousel({ items, className }: ThreeDPhotoCarouselProps) {
  const reducedMotion = useReducedMotion();
  const carouselItems = useMemo(() => items, [items]);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);

  if (reducedMotion) {
    const preview = carouselItems.slice(0, 3);
    return (
      <div className={cn("grid grid-cols-3 gap-2", className)}>
        {preview.map((item) =>
          item.kind === "image" ? (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl border border-line">
              <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="120px" />
            </div>
          ) : (
            <FounderFace key={item.id} founder={item.founder} />
          ),
        )}
      </div>
    );
  }

  return (
    <motion.div layout className={cn("relative h-full w-full", className)}>
      <AnimatePresence>
        {activeImg ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveImg(null);
              setIsCarouselActive(true);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-scene-void/85 p-6 backdrop-blur-sm"
            transition={transitionOverlay}
            aria-label="Close image preview"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[min(70vh,520px)] w-[min(90vw,520px)]"
            >
              <Image src={activeImg} alt="" fill className="rounded-xl object-contain" sizes="520px" />
            </motion.div>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <Carousel
        items={carouselItems}
        isCarouselActive={isCarouselActive}
        onImageClick={(src) => {
          setActiveImg(src);
          setIsCarouselActive(false);
        }}
      />
    </motion.div>
  );
}
