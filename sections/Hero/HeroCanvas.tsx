"use client";

import { useEffect, useRef } from "react";
import { useFrameSequence } from "./useFrameSequence";
import { heroBehavior, heroInitialWindow, heroSequence } from "./hero.config";
import { useNetworkProfile } from "@/hooks/useNetworkProfile";

type HeroCanvasProps = {
  /** 0..1, mutated by the parent's ScrollTrigger callback every frame — read here, never via React state. */
  progressRef: React.RefObject<number>;
  onFirstFrameReady?: () => void;
  onBootProgress?: (state: {
    loadedCount: number;
    targetCount: number;
    progress: number;
    initialReady: boolean;
  }) => void;
  /**
   * Decided once by the parent and used as its React `key`, so switching
   * breakpoints fully remounts this component instead of reusing a frame
   * cache keyed by indices that mean different files in each sequence.
   */
  isSmallScreen: boolean;
};

export function HeroCanvas({
  progressRef,
  onFirstFrameReady,
  onBootProgress,
  isSmallScreen,
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const networkProfile = useNetworkProfile();

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

  const { getFrame, preloadAround, firstFrameReady, loadedCount, bootTarget, initialReady } =
    useFrameSequence({
      frameCount: sequence.frameCount,
      framePath: sequence.framePath,
      initialWindow: heroInitialWindow(networkProfile),
      cacheWindow: heroBehavior.cacheWindow,
      networkProfile,
    });

  useEffect(() => {
    if (firstFrameReady) onFirstFrameReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFrameReady]);

  useEffect(() => {
    onBootProgress?.({
      loadedCount,
      targetCount: bootTarget,
      progress: bootTarget > 0 ? loadedCount / bootTarget : 0,
      initialReady,
    });
  }, [bootTarget, initialReady, loadedCount, onBootProgress]);

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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let rafId = 0;
    let lastDrawnIndex = -1;
    let lastPreloadIndex = -1;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      const progress = Math.min(1, Math.max(0, progressRef.current ?? 0));
      const frameIndex = Math.min(
        sequence.frameCount - 1,
        Math.floor(progress * sequence.frameCount)
      );

      if (frameIndex !== lastPreloadIndex) {
        lastPreloadIndex = frameIndex;
        preloadAround(frameIndex);
      }

      const image = getFrame(frameIndex);
      if (!image || frameIndex === lastDrawnIndex) return;

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
        sw = sequence.frameHeight * dstAspect;
        sx = (sequence.frameWidth - sw) / 2;
      } else {
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
