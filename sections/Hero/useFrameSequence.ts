"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SequenceConfig = {
  frameCount: number;
  framePath: (index: number) => string;
  initialWindow: number;
  cacheWindow: number;
};

type FrameEntry = {
  image: HTMLImageElement;
  loaded: boolean;
  failed: boolean;
};

/**
 * Loads and caches the hero frame sequence without ever holding all frames
 * decoded in memory at once. Exposes an imperative `getFrame` for the canvas's
 * own render loop (so scroll never triggers a React re-render) plus a small
 * amount of state for the loading indicator.
 */
export function useFrameSequence({
  frameCount,
  framePath,
  initialWindow,
  cacheWindow,
}: SequenceConfig) {
  const cacheRef = useRef<Map<number, FrameEntry>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const lastRequestedRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const mountedRef = useRef(true);

  const loadFrame = useCallback(
    (index: number) => {
      if (index < 0 || index >= frameCount) return;
      if (cacheRef.current.has(index) || pendingRef.current.has(index)) return;

      pendingRef.current.add(index);
      const img = new window.Image();
      const entry: FrameEntry = { image: img, loaded: false, failed: false };

      const finalize = (failed: boolean) => {
        if (!mountedRef.current) return;
        pendingRef.current.delete(index);
        entry.loaded = !failed;
        entry.failed = failed;
        cacheRef.current.set(index, entry);
        if (!failed) {
          setLoadedCount((c) => c + 1);
          if (index === 0) setFirstFrameReady(true);
        }
      };

      img.onload = () => {
        if (typeof img.decode === "function") {
          img.decode().then(() => finalize(false)).catch(() => finalize(false));
        } else {
          finalize(false);
        }
      };
      img.onerror = () => finalize(true);
      img.src = framePath(index);
    },
    [frameCount, framePath]
  );

  const evictFar = useCallback(
    (centerIndex: number) => {
      const cache = cacheRef.current;
      if (cache.size <= cacheWindow) return;
      const distances = Array.from(cache.keys()).sort(
        (a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex)
      );
      const overflow = cache.size - cacheWindow;
      for (let i = 0; i < overflow; i++) {
        const idx = distances[i];
        if (idx === 0) continue; // keep the opening frame resident always
        cache.delete(idx);
      }
    },
    [cacheWindow]
  );

  /** Requests frames around `index`, prioritized by distance and scroll direction. */
  const preloadAround = useCallback(
    (index: number) => {
      if (index > lastRequestedRef.current) directionRef.current = 1;
      else if (index < lastRequestedRef.current) directionRef.current = -1;
      lastRequestedRef.current = index;

      const dir = directionRef.current;
      const radius = Math.ceil(cacheWindow / 2);
      const order: number[] = [];
      for (let d = 0; d <= radius; d++) {
        const ahead = index + d * dir;
        const behind = index - d * dir;
        if (d === 0) {
          order.push(index);
        } else {
          order.push(ahead, behind);
        }
      }
      order.forEach((i) => loadFrame(i));
      evictFar(index);
    },
    [cacheWindow, loadFrame, evictFar]
  );

  /** Synchronous lookup for the render loop: exact frame, or nearest available. */
  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    const exact = cacheRef.current.get(index);
    if (exact?.loaded) return exact.image;

    for (let d = 1; d < 24; d++) {
      const after = cacheRef.current.get(index + d);
      if (after?.loaded) return after.image;
      const before = cacheRef.current.get(index - d);
      if (before?.loaded) return before.image;
    }
    return null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    for (let i = 0; i < Math.min(initialWindow, frameCount); i++) {
      loadFrame(i);
    }
    // Also warm the closing frame immediately so the "resolved system" end
    // state can appear even before the full sequence finishes loading.
    loadFrame(frameCount - 1);

    // Background warm-up: request every remaining frame in small batches
    // during idle time. This is what keeps fast scrolling from ever falling
    // back to a stale/far-away frame — by the time the user gets there, the
    // browser has already fetched (and often decoded) it. Decoded-frame
    // memory still stays bounded: we evict around the *real* current scroll
    // position after every batch, not around wherever this scan currently is.
    let cancelled = false;
    let cursor = 0;
    const BATCH_SIZE = 8;

    const scheduleIdle = (callback: () => void) => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(callback, { timeout: 500 });
      } else {
        window.setTimeout(callback, 120);
      }
    };

    const step = () => {
      if (cancelled || cursor >= frameCount) return;
      for (let n = 0; n < BATCH_SIZE && cursor < frameCount; cursor++, n++) {
        loadFrame(cursor);
      }
      evictFar(lastRequestedRef.current);
      scheduleIdle(step);
    };
    scheduleIdle(step);

    return () => {
      mountedRef.current = false;
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getFrame, preloadAround, firstFrameReady, loadedCount };
}
