"use client";

import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ElementType, RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TimelineContentProps = {
  as?: ElementType;
  animationNum?: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children?: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "ref" | "children">;

const defaultRevealVariants: Variants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  hidden: {
    filter: "blur(8px)",
    y: -16,
    opacity: 0,
  },
};

function resolveMotionComponent(as: ElementType = "div") {
  if (typeof as === "string" && as in motion) {
    return motion[as as keyof typeof motion] as typeof motion.div;
  }

  return motion.div;
}

export function TimelineContent({
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps) {
  const reducedMotion = useReducedMotion();
  const isInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const MotionComponent = resolveMotionComponent(as);
  const variants = customVariants ?? defaultRevealVariants;

  return (
    <MotionComponent
      custom={animationNum}
      initial={reducedMotion ? false : "hidden"}
      animate={reducedMotion || isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
