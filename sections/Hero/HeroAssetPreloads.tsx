import { heroSequence } from "./hero.config";

/**
 * Starts fetching the poster and first scroll frame before React hydrates.
 * Media queries ensure only the relevant sequence is preloaded per viewport.
 */
export function HeroAssetPreloads() {
  const desktopFrame = heroSequence.framePath(0);
  const mobileFrame = heroSequence.mobile.framePath(0);

  return (
    <>
      <link rel="preload" as="image" href={heroSequence.posterPath} fetchPriority="high" />
      <link
        rel="preload"
        as="image"
        href={desktopFrame}
        fetchPriority="high"
        media="(min-width: 769px)"
      />
      <link
        rel="preload"
        as="image"
        href={mobileFrame}
        fetchPriority="high"
        media="(max-width: 768px)"
      />
    </>
  );
}
