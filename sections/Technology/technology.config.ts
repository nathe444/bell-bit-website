/** Scroll-linked technology stack timing — aligned with hero / projects scrub. */
export const technologyBehavior = {
  vhPerGroup: 1.15,
  scrubSmoothing: 0.55,
  firstStackHoldDuration: 0.48,
  enterDuration: 0.38,
  holdDuration: 0.42,
  exitDuration: 0.28,
  enterEase: "power3.out",
  exitEase: "power2.in",
} as const;
