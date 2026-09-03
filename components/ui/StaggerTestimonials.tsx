"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SQRT_5000 = Math.sqrt(5000);
const AUTO_ADVANCE_MS = 5500;

type StaggerTestimonialsProps = {
  testimonials: readonly Testimonial[];
};

type TestimonialCardProps = {
  position: number;
  testimonial: Testimonial;
  cardSize: number;
  onSelect: () => void;
  reducedMotion: boolean;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function getWrappedPosition(index: number, activeIndex: number, length: number) {
  let position = index - activeIndex;
  if (position > length / 2) position -= length;
  if (position < -length / 2) position += length;
  return position;
}

function getCardZIndex(position: number) {
  return 40 - Math.abs(position) * 10;
}

function TestimonialCard({
  position,
  testimonial,
  cardSize,
  onSelect,
  reducedMotion,
}: TestimonialCardProps) {
  const isCenter = position === 0;
  const authorName = testimonial.by.split(",")[0]?.trim() ?? testimonial.by;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-hidden={!isCenter}
      tabIndex={isCenter ? 0 : -1}
      className={cn(
        "absolute left-1/2 top-1/2 isolate text-left transition-all ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void",
        reducedMotion ? "duration-200" : "duration-500",
        isCenter
          ? "cursor-default border-2 border-signal bg-signal text-on-signal"
          : "cursor-pointer border-2 border-line bg-surface text-paper hover:border-signal-soft/50",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        zIndex: getCardZIndex(position),
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          scale(${isCenter ? 1 : 0.94})
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px color-mix(in srgb, var(--color-line-strong) 65%, transparent)"
          : "0px 4px 24px color-mix(in srgb, var(--color-scene-void) 35%, transparent)",
      }}
    >
      <span
        aria-hidden
        className="absolute block origin-top-right rotate-45 bg-line-strong"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={testimonial.imgSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn(
          "mb-4 h-14 w-12 object-cover object-top",
          isCenter ? "bg-on-signal/20" : "bg-surface-raised",
        )}
        style={{
          boxShadow: isCenter
            ? "3px 3px 0px color-mix(in srgb, var(--color-on-signal) 35%, transparent)"
            : "3px 3px 0px var(--color-void)",
        }}
      />
      <p
        className={cn(
          "pr-2 font-display text-base leading-snug sm:text-xl",
          isCenter ? "text-on-signal" : "text-paper",
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 text-sm not-italic",
          isCenter ? "text-on-signal/80" : "text-paper-dim",
        )}
      >
        — {testimonial.by}
      </p>
      <span className="sr-only">{authorName}</span>
    </button>
  );
}

export function StaggerTestimonials({ testimonials }: StaggerTestimonialsProps) {
  const reducedMotion = useReducedMotion();
  const [cardSize, setCardSize] = useState(365);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (steps: number) => {
      setActiveIndex((prev) => {
        const length = testimonials.length;
        return (prev + steps + length) % length;
      });
    },
    [testimonials.length],
  );

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || testimonials.length <= 1) return;

    const intervalId = window.setInterval(() => {
      handleMove(1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(intervalId);
  }, [handleMove, isPaused, reducedMotion, testimonials.length]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleMove(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleMove(1);
    }
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      className="relative mt-16 w-full overflow-hidden rounded-2xl border border-line bg-ink"
      style={{ height: 600 }}
    >
      {testimonials
        .map((testimonial, index) => ({
          testimonial,
          position: getWrappedPosition(index, activeIndex, testimonials.length),
        }))
        .filter(({ position }) => Math.abs(position) <= 3)
        .sort((a, b) => Math.abs(b.position) - Math.abs(a.position))
        .map(({ testimonial, position }) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            position={position}
            cardSize={cardSize}
            reducedMotion={reducedMotion}
            onSelect={() => {
              if (position !== 0) handleMove(position);
            }}
          />
        ))}

      <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          onClick={() => handleMove(-1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-line-strong bg-surface text-paper transition-colors hover:border-signal-soft hover:bg-signal hover:text-on-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          aria-label="Previous testimonial"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="flex items-center gap-1.5" aria-hidden>
          {testimonials.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex ? "w-5 bg-signal-soft" : "w-1.5 bg-line-strong",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleMove(1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-line-strong bg-surface text-paper transition-colors hover:border-signal-soft hover:bg-signal hover:text-on-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          aria-label="Next testimonial"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </div>
  );
}
