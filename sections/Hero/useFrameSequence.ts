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
 * Loads and caches the hero frame sequence with a bounded hot window.
 * Evicted frames move to a cold store so the same URL is never fetched twice
 * in one session.
 */
export function useFrameSequence({
  frameCount,
  framePath,
  initialWindow,
  cacheWindow,
}: SequenceConfig) {
  const cacheRef = useRef<Map<number, FrameEntry>>(new Map());
  const coldCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const lastRequestedRef = useRef(-1);
  const lastEvictCenterRef = useRef(-1);
  const directionRef = useRef<1 | -1>(1);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const mountedRef = useRef(true);

  const loadFrame = useCallback(
    (index: number) => {
      if (index < 0 || index >= frameCount) return;
      if (cacheRef.current.has(index) || pendingRef.current.has(index)) return;

      const cold = coldCacheRef.current.get(index);
      if (cold) {
        coldCacheRef.current.delete(index);
        cacheRef.current.set(index, { image: cold, loaded: true, failed: false });
        return;
      }

      pendingRef.current.add(index);
      const img = new window.Image();
      img.decoding = "async";
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
      // Only run eviction when the playhead moves — not on redundant calls.
      if (centerIndex === lastEvictCenterRef.current) return;
      lastEvictCenterRef.current = centerIndex;

      const cache = cacheRef.current;
      if (cache.size <= cacheWindow) return;

      const keepRadius = Math.ceil(cacheWindow * 0.6);
      const candidates = Array.from(cache.keys())
        .filter((idx) => idx !== 0 && idx !== frameCount - 1)
        .filter((idx) => Math.abs(idx - centerIndex) > keepRadius)
        .sort((a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex));

      const overflow = cache.size - cacheWindow;
      for (let i = 0; i < overflow && i < candidates.length; i++) {
        const idx = candidates[i]!;
        const entry = cache.get(idx);
        if (entry?.loaded) coldCacheRef.current.set(idx, entry.image);
        cache.delete(idx);
      }

      // Bound cold storage — drop oldest far-from-center images only after hot eviction.
      const coldMax = cacheWindow * 2;
      if (coldCacheRef.current.size > coldMax) {
        const coldKeys = Array.from(coldCacheRef.current.keys()).sort(
          (a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex)
        );
        const coldOverflow = coldCacheRef.current.size - coldMax;
        for (let i = 0; i < coldOverflow; i++) {
          coldCacheRef.current.delete(coldKeys[i]!);
        }
      }
    },
    [cacheWindow, frameCount]
  );

  /** Requests frames around `index`, prioritized by distance and scroll direction. */
  const preloadAround = useCallback(
    (index: number) => {
      const prev = lastRequestedRef.current;
      if (index === prev) return;

      if (index > prev) directionRef.current = 1;
      else if (index < prev) directionRef.current = -1;
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
          if (ahead >= 0 && ahead < frameCount) order.push(ahead);
          if (behind >= 0 && behind < frameCount) order.push(behind);
        }
      }
      order.forEach((i) => loadFrame(i));
      evictFar(index);
    },
    [cacheWindow, frameCount, loadFrame, evictFar]
  );

  /** Synchronous lookup for the render loop: exact frame, or nearest available. */
  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    const exact = cacheRef.current.get(index);
    if (exact?.loaded) return exact.image;

    for (let d = 1; d < 48; d++) {
      const after = cacheRef.current.get(index + d);
      if (after?.loaded) return after.image;
      const before = cacheRef.current.get(index - d);
      if (before?.loaded) return before.image;
    }
    return null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    cacheRef.current.clear();
    coldCacheRef.current.clear();
    pendingRef.current.clear();
    lastRequestedRef.current = -1;
    lastEvictCenterRef.current = -1;

    for (let i = 0; i < Math.min(initialWindow, frameCount); i++) {
      loadFrame(i);
    }
    loadFrame(frameCount - 1);

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return { getFrame, preloadAround, firstFrameReady, loadedCount };
}
