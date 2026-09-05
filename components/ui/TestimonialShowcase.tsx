"use client";

import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

type TestimonialShowcaseProps = {
  testimonials: readonly Testimonial[];
};

export function TestimonialShowcase({ testimonials }: TestimonialShowcaseProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0]?.quote ?? "");
  const [displayedRole, setDisplayedRole] = useState(testimonials[0]?.role ?? "");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;

    if (reducedMotion) {
      setDisplayedQuote(testimonials[index].quote);
      setDisplayedRole(testimonials[index].role);
      setActiveIndex(index);
      return;
    }

    setIsAnimating(true);

    window.setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote);
      setDisplayedRole(testimonials[index].role);
      setActiveIndex(index);
      window.setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  if (testimonials.length === 0) return null;

  return (
    <div
      className="mx-auto flex max-w-4xl flex-col items-center gap-12 md:gap-14"
      aria-label="Client testimonials"
    >
      <div className="relative px-6 md:px-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 -top-8 select-none font-serif text-8xl text-paper/[0.06] md:text-9xl"
        >
          &ldquo;
        </span>

        <p
          aria-live="polite"
          className={cn(
            "max-w-3xl text-balance text-center font-display text-[clamp(1.75rem,4.5vw,3.25rem)] font-light leading-snug text-paper md:leading-tight",
            !reducedMotion && "transition-all duration-[400ms] ease-out",
            !reducedMotion && isAnimating
              ? "scale-[0.98] opacity-0 blur-sm"
              : "scale-100 opacity-100 blur-0",
          )}
        >
          {displayedQuote}
        </p>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-2 select-none font-serif text-8xl text-paper/[0.06] md:text-9xl"
        >
          &rdquo;
        </span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <p
          className={cn(
            "text-sm uppercase tracking-[0.2em] text-paper-faint md:text-base",
            !reducedMotion && "transition-all duration-500 ease-out",
            !reducedMotion && isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {displayedRole}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index && !isActive;
            const showName = isActive || isHovered;

            return (
              <button
                key={testimonial.id}
                type="button"
                aria-label={`Show testimonial from ${testimonial.author}`}
                aria-pressed={isActive}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex cursor-pointer items-center gap-0 rounded-full border",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive
                    ? "border-paper bg-paper shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] dark:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.55)]"
                    : "border-line-strong bg-surface hover:border-signal-soft/50 hover:bg-surface-raised",
                  showName ? "py-2 pl-2 pr-5" : "p-1",
                )}
              >
                <div className="relative shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "h-12 w-12 rounded-full object-cover",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isActive ? "ring-2 ring-void/40" : "ring-1 ring-line",
                      !isActive && !reducedMotion && "hover:scale-105",
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "ml-2.5 grid-cols-[1fr] opacity-100" : "ml-0 grid-cols-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "block whitespace-nowrap text-sm font-medium transition-colors duration-300 md:text-base",
                        isActive ? "text-void" : "text-paper",
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
