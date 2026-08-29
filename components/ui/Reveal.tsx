"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const SIGNATURE_EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
};

/** The one reveal motion used across every section: a slow, precise rise-and-fade. */
export function Reveal({ children, delay = 0, className, y = 28 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: SIGNATURE_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
