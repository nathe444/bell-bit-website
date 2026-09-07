"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type HeroBootScreenProps = {
  visible: boolean;
  progress: number;
  posterReady: boolean;
  posterSrc: string;
};

const bootWords = ["Complexity", "Structure", "System"] as const;

export function HeroBootScreen({
  visible,
  progress,
  posterReady,
  posterSrc,
}: HeroBootScreenProps) {
  const reducedMotion = useReducedMotion();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="hero-boot"
          role="status"
          aria-live="polite"
          aria-label="Loading hero experience"
          className="fixed inset-0 z-[200] overflow-hidden bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: posterReady ? 0.28 : 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={posterSrc} alt="" fill priority className="object-cover blur-2xl" aria-hidden />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(37,99,235,0.14),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(77,132,247,0.12),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/20 via-void/55 to-void" />

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <BrandLogo
                className="h-9 w-auto sm:h-10"
                width={160}
                height={48}
                priority
                appearance="on-dark-scene"
              />

              <p className="mt-8 max-w-xs text-balance text-sm leading-relaxed text-scene-paper-dim">
                We turn complexity into systems.
              </p>
            </motion.div>

            <div className="absolute bottom-[clamp(3rem,12vh,5.5rem)] flex w-full max-w-sm flex-col items-center gap-5 px-4">
              <div className="flex w-full items-center justify-between gap-3 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-scene-paper-faint">
                {bootWords.map((word, index) => (
                  <span
                    key={word}
                    className={cn(
                      "transition-colors duration-500",
                      clampedProgress >= (index + 1) / bootWords.length && "text-signal-soft",
                    )}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-scene-line/80">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signal/70 via-signal to-signal-soft shadow-[0_0_24px_var(--color-signal-glow)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${clampedProgress * 100}%` }}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent"
            animate={reducedMotion ? undefined : { opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
