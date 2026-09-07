"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NetworkProfile } from "@/lib/networkProfile";
import { heroLoadConcurrency } from "./hero.config";

type SequenceConfig = {
  frameCount: number;
  framePath: (index: number) => string;
  initialWindow: number;
  cacheWindow: number;
  networkProfile: NetworkProfile;
};

type FrameEntry = {
  image: HTMLImageElement;
  loaded: boolean;
  failed: boolean;
};

function setImageFetchPriority(img: HTMLImageElement, priority: "high" | "low" | "auto") {
  if ("fetchPriority" in img) {
    (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = priority;
  }
}

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
  networkProfile,
}: SequenceConfig) {
  const cacheRef = useRef<Map<number, FrameEntry>>(new Map());
  const coldCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const queueRef = useRef<number[]>([]);
  const queuedSetRef = useRef<Set<number>>(new Set());
  const lastRequestedRef = useRef(-1);
  const lastEvictCenterRef = useRef(-1);
  const directionRef = useRef<1 | -1>(1);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const mountedRef = useRef(true);
  const maxConcurrent = heroLoadConcurrency(networkProfile);

  const pumpQueue = useCallback(() => {
    while (pendingRef.current.size < maxConcurrent && queueRef.current.length > 0) {
      const index = queueRef.current.shift()!;
      queuedSetRef.current.delete(index);

      if (index < 0 || index >= frameCount) continue;
      if (cacheRef.current.has(index) || pendingRef.current.has(index)) continue;

      const cold = coldCacheRef.current.get(index);
      if (cold) {
        coldCacheRef.current.delete(index);
        cacheRef.current.set(index, { image: cold, loaded: true, failed: false });
        if (index === 0) setFirstFrameReady(true);
        continue;
      }

      pendingRef.current.add(index);
      const img = new window.Image();
      img.decoding = "async";
      setImageFetchPriority(img, index === 0 ? "high" : "low");
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
        pumpQueue();
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
    }
  }, [frameCount, framePath, maxConcurrent]);

  const enqueueFrame = useCallback(
    (index: number) => {
      if (index < 0 || index >= frameCount) return;
      if (
        cacheRef.current.has(index) ||
        pendingRef.current.has(index) ||
        queuedSetRef.current.has(index)
      ) {
        return;
      }
      queuedSetRef.current.add(index);
      queueRef.current.push(index);
      pumpQueue();
    },
    [frameCount, pumpQueue],
  );

  const evictFar = useCallback(
    (centerIndex: number) => {
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

      const coldMax = cacheWindow * 2;
      if (coldCacheRef.current.size > coldMax) {
        const coldKeys = Array.from(coldCacheRef.current.keys()).sort(
          (a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex),
        );
        const coldOverflow = coldCacheRef.current.size - coldMax;
        for (let i = 0; i < coldOverflow; i++) {
          coldCacheRef.current.delete(coldKeys[i]!);
        }
      }
    },
    [cacheWindow, frameCount],
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
      order.forEach((i) => enqueueFrame(i));
      evictFar(index);
    },
    [cacheWindow, frameCount, enqueueFrame, evictFar],
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
    queueRef.current = [];
    queuedSetRef.current.clear();
    lastRequestedRef.current = -1;
    lastEvictCenterRef.current = -1;
    setFirstFrameReady(false);
    setLoadedCount(0);

    // Frame 0 alone first — on slow networks it must not compete with a burst of peers.
    enqueueFrame(0);

    const deferInitialBatch = networkProfile === "slow" ? 400 : 0;
    const deferFinalFrame = networkProfile === "slow";

    const batchTimer = window.setTimeout(() => {
      for (let i = 1; i < Math.min(initialWindow, frameCount); i++) {
        enqueueFrame(i);
      }
      if (!deferFinalFrame) {
        enqueueFrame(frameCount - 1);
      }
    }, deferInitialBatch);

    const finalTimer = deferFinalFrame
      ? window.setTimeout(() => enqueueFrame(frameCount - 1), deferInitialBatch + 1200)
      : undefined;

    return () => {
      mountedRef.current = false;
      window.clearTimeout(batchTimer);
      if (finalTimer !== undefined) window.clearTimeout(finalTimer);
    };
  }, [enqueueFrame, frameCount, initialWindow, networkProfile]);

  return { getFrame, preloadAround, firstFrameReady, loadedCount };
}
