/** Scroll-linked case dossier timing — aligned with hero Lenis scrub. */
export const projectBehavior = {
  /** Viewport-heights of scroll per project (enter + hold + exit). */
  vhPerProject: 1.25,
  /** Matches heroBehavior.scrubSmoothing for consistent feel sitewide. */
  scrubSmoothing: 0.55,
  /** GSAP timeline segment durations (relative units, not seconds). */
  enterDuration: 0.42,
  holdDuration: 0.48,
  exitDuration: 0.22,
  /** Battle-pass style overshoot on reward claim. */
  claimEase: "back.out(2.4)",
  claimExitEase: "power3.in",
} as const;

export function projectRegistryId(index: number) {
  return `PRJ-${String(index + 1).padStart(2, "0")}`;
}
