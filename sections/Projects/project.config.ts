/** Scroll-linked case dossier timing — aligned with hero Lenis scrub. */
export const projectBehavior = {
  /** Viewport-heights of scroll per project (enter + hold + exit). */
  vhPerProject: 1.25,
  /** Matches heroBehavior.scrubSmoothing for consistent feel sitewide. */
  scrubSmoothing: 0.55,
  /** GSAP timeline segment durations (relative units, not seconds). */
  enterDuration: 0.35,
  holdDuration: 0.5,
  exitDuration: 0.25,
} as const;

export function projectRegistryId(index: number) {
  return `PRJ-${String(index + 1).padStart(2, "0")}`;
}
