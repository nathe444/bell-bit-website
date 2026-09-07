"use client";

import { AnimatePresence, motion } from "motion/react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { heroPrimary } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type HeroBootScreenProps = {
  visible: boolean;
  progress: number;
};

const bootWords = ["Complexity", "Structure", "System"] as const;

/** Boot screen always uses the dark hero palette — independent of site theme. */
export function HeroBootScreen({ visible, progress }: HeroBootScreenProps) {
  const reducedMotion = useReducedMotion();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const bootTagline = `${heroPrimary.headline[0]} ${heroPrimary.headline[1]}`;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="hero-boot"
          role="status"
          aria-live="polite"
          aria-label="Loading hero experience"
          className="fixed inset-0 z-[200] overflow-hidden bg-[#141820] text-scene-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(77,132,247,0.1),transparent_62%)]" />

          <div className="relative flex h-full items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full max-w-lg flex-col items-center text-center"
            >
              <BrandLogo
                className="h-12 w-auto sm:h-14 md:h-16"
                width={220}
                height={64}
                priority
                appearance="on-dark-scene"
              />

              <p className="mt-8 max-w-md text-balance font-display text-xl font-medium leading-snug text-scene-paper sm:mt-10 sm:text-2xl md:text-[1.75rem]">
                {bootTagline}
              </p>

              <div className="mt-10 w-full sm:mt-12">
                <div className="mb-4 flex w-full items-center justify-between gap-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-scene-paper-faint sm:text-xs">
                  {bootWords.map((word, index) => (
                    <span
                      key={word}
                      className={cn(
                        "transition-colors duration-500",
                        clampedProgress >= (index + 1) / bootWords.length && "text-[#7ba4ff]",
                      )}
                    >
                      {word}
                    </span>
                  ))}
                </div>

                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-scene-line sm:h-3">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4d84f7] via-[#4d84f7] to-[#7ba4ff]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${clampedProgress * 100}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
