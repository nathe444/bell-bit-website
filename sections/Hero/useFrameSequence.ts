"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NetworkProfile } from "@/lib/networkProfile";
import {
  heroBootLoadConcurrency,
  heroBootTargetCount,
  heroLoadConcurrency,
} from "./hero.config";

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
  const bootPhaseRef = useRef(true);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const mountedRef = useRef(true);
  const scrollConcurrency = heroLoadConcurrency(networkProfile);
  const bootConcurrency = heroBootLoadConcurrency(networkProfile);
  const bootTarget = heroBootTargetCount(frameCount);

  const getMaxConcurrent = useCallback(
    () => (bootPhaseRef.current ? bootConcurrency : scrollConcurrency),
    [bootConcurrency, scrollConcurrency],
  );

  const markLoaded = useCallback((index: number) => {
    setLoadedCount((c) => c + 1);
    if (index === 0) setFirstFrameReady(true);
  }, []);

  const pumpQueue = useCallback(() => {
    const maxConcurrent = getMaxConcurrent();

    while (pendingRef.current.size < maxConcurrent && queueRef.current.length > 0) {
      const index = queueRef.current.shift()!;
      queuedSetRef.current.delete(index);

      if (index < 0 || index >= frameCount) continue;
      if (cacheRef.current.has(index) || pendingRef.current.has(index)) continue;

      const cold = coldCacheRef.current.get(index);
      if (cold) {
        coldCacheRef.current.delete(index);
        cacheRef.current.set(index, { image: cold, loaded: true, failed: false });
        markLoaded(index);
        continue;
      }

      pendingRef.current.add(index);
      const img = new window.Image();
      img.decoding = "async";
      setImageFetchPriority(img, index === 0 ? "high" : bootPhaseRef.current ? "auto" : "low");
      const entry: FrameEntry = { image: img, loaded: false, failed: false };

      const finalize = (failed: boolean) => {
        if (!mountedRef.current) return;
        pendingRef.current.delete(index);
        entry.loaded = !failed;
        entry.failed = failed;
        cacheRef.current.set(index, entry);
        if (!failed) markLoaded(index);
        pumpQueue();
      };

      // Count frames on load — skip decode during boot; the browser decodes on drawImage.
      img.onload = () => finalize(false);
      img.onerror = () => finalize(true);
      img.src = framePath(index);
    }
  }, [frameCount, framePath, getMaxConcurrent, markLoaded]);

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
    if (initialReady) return;
    if (firstFrameReady && loadedCount >= bootTarget) {
      bootPhaseRef.current = false;
      setInitialReady(true);
      pumpQueue();
    }
  }, [bootTarget, firstFrameReady, initialReady, loadedCount, pumpQueue]);

  useEffect(() => {
    mountedRef.current = true;
    bootPhaseRef.current = true;
    cacheRef.current.clear();
    coldCacheRef.current.clear();
    pendingRef.current.clear();
    queueRef.current = [];
    queuedSetRef.current.clear();
    lastRequestedRef.current = -1;
    lastEvictCenterRef.current = -1;
    setFirstFrameReady(false);
    setLoadedCount(0);
    setInitialReady(false);

    enqueueFrame(0);

    const deferBootBatch = networkProfile === "slow" ? 200 : 0;

    const bootTimer = window.setTimeout(() => {
      for (let i = 1; i < bootTarget; i++) {
        enqueueFrame(i);
      }
      if (networkProfile !== "slow" && frameCount - 1 >= bootTarget) {
        enqueueFrame(frameCount - 1);
      }
    }, deferBootBatch);

    const finalTimer =
      networkProfile === "slow"
        ? window.setTimeout(() => enqueueFrame(frameCount - 1), deferBootBatch + 800)
        : undefined;

    return () => {
      mountedRef.current = false;
      window.clearTimeout(bootTimer);
      if (finalTimer !== undefined) window.clearTimeout(finalTimer);
    };
  }, [bootTarget, enqueueFrame, frameCount, networkProfile]);

  useEffect(() => {
    if (!initialReady) return;
    for (let i = bootTarget; i < Math.min(initialWindow, frameCount); i++) {
      enqueueFrame(i);
    }
  }, [bootTarget, enqueueFrame, frameCount, initialReady, initialWindow]);

  return {
    getFrame,
    preloadAround,
    firstFrameReady,
    loadedCount,
    bootTarget,
    initialReady,
  };
}
