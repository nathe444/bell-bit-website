"use client";

import { useEffect, useRef } from "react";
import { useFrameSequence } from "./useFrameSequence";
import { heroSequence, heroBehavior } from "./hero.config";

type HeroCanvasProps = {
  /** 0..1, mutated by the parent's ScrollTrigger callback every frame — read here, never via React state. */
  progressRef: React.RefObject<number>;
  onFirstFrameReady?: () => void;
  /**
   * Decided once by the parent and used as its React `key`, so switching
   * breakpoints fully remounts this component instead of reusing a frame
   * cache keyed by indices that mean different files in each sequence.
   */
  isSmallScreen: boolean;
};

export function HeroCanvas({ progressRef, onFirstFrameReady, isSmallScreen }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sequence = isSmallScreen
    ? {
        frameCount: heroSequence.mobile.frameCount,
        framePath: heroSequence.mobile.framePath,
        frameWidth: heroSequence.mobile.frameWidth,
        frameHeight: heroSequence.mobile.frameHeight,
      }
    : {
        frameCount: heroSequence.frameCount,
        framePath: heroSequence.framePath,
        frameWidth: heroSequence.frameWidth,
        frameHeight: heroSequence.frameHeight,
      };

  const { getFrame, preloadAround, firstFrameReady } = useFrameSequence({
    frameCount: sequence.frameCount,
    framePath: sequence.framePath,
    initialWindow: heroBehavior.initialWindow,
    cacheWindow: heroBehavior.cacheWindow,
  });

  useEffect(() => {
    if (firstFrameReady) onFirstFrameReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFrameReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Resizing the backing store resets 2D context state, so smoothing
      // has to be reapplied every time — otherwise it silently reverts to
      // low quality after the first resize (including the initial one on Safari).
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let rafId = 0;
    let lastDrawnIndex = -1;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      const progress = Math.min(1, Math.max(0, progressRef.current ?? 0));
      const frameIndex = Math.round(progress * (sequence.frameCount - 1));
      preloadAround(frameIndex);

      const image = getFrame(frameIndex);
      if (!image || (frameIndex === lastDrawnIndex && width && height)) return;
      lastDrawnIndex = frameIndex;

      const canvasW = width * dpr;
      const canvasH = height * dpr;
      if (!canvasW || !canvasH) return;

      const srcAspect = sequence.frameWidth / sequence.frameHeight;
      const dstAspect = canvasW / canvasH;

      let sx = 0;
      let sy = 0;
      let sw = sequence.frameWidth;
      let sh = sequence.frameHeight;

      if (srcAspect > dstAspect) {
        // Source is wider than destination: crop the sides.
        sw = sequence.frameHeight * dstAspect;
        sx = (sequence.frameWidth - sw) / 2;
      } else {
        // Source is taller than destination: crop top/bottom.
        sh = sequence.frameWidth / dstAspect;
        sy = (sequence.frameHeight - sh) / 2;
      }

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence.frameCount, sequence.frameWidth, sequence.frameHeight, getFrame, preloadAround]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
