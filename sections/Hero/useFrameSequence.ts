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
  cacheWindow,
  networkProfile,
}: SequenceConfig) {
  const cacheRef = useRef<Map<number, FrameEntry>>(new Map());
  const coldCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingRef = useRef<Set<number>>(new Set());
  const urgentQueueRef = useRef<number[]>([]);
  const backfillQueueRef = useRef<number[]>([]);
  const queuedSetRef = useRef<Set<number>>(new Set());
  const lastRequestedRef = useRef(-1);
  const lastEvictCenterRef = useRef(-1);
  const directionRef = useRef<1 | -1>(1);
  const bootPhaseRef = useRef(true);
  const loadedCountRef = useRef(0);
  const backfillStartedRef = useRef(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const mountedRef = useRef(true);
  const scrollConcurrency = heroLoadConcurrency(networkProfile);
  const bootConcurrency = heroBootLoadConcurrency(networkProfile);
  const bootTarget = heroBootTargetCount(frameCount);

  const getMaxConcurrent = useCallback(() => {
    if (bootPhaseRef.current) return bootConcurrency;
    if (loadedCountRef.current < frameCount) return bootConcurrency;
    return scrollConcurrency;
  }, [bootConcurrency, frameCount, scrollConcurrency]);

  const markLoaded = useCallback((index: number) => {
    loadedCountRef.current += 1;
    setLoadedCount(loadedCountRef.current);
    if (index === 0) setFirstFrameReady(true);
  }, []);

  const isQueuedOrCached = useCallback((index: number) => {
    return (
      cacheRef.current.has(index) ||
      pendingRef.current.has(index) ||
      queuedSetRef.current.has(index)
    );
  }, []);

  const pumpQueue = useCallback(() => {
    const maxConcurrent = getMaxConcurrent();

    while (pendingRef.current.size < maxConcurrent) {
      const index = urgentQueueRef.current.shift() ?? backfillQueueRef.current.shift();
      if (index === undefined) break;

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
      setImageFetchPriority(img, index === 0 ? "high" : "auto");
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

      img.onload = () => finalize(false);
      img.onerror = () => finalize(true);
      img.src = framePath(index);
    }
  }, [frameCount, framePath, getMaxConcurrent, markLoaded]);

  const enqueueFrame = useCallback(
    (index: number, urgent = false) => {
      if (index < 0 || index >= frameCount) return;
      if (isQueuedOrCached(index)) return;

      queuedSetRef.current.add(index);
      if (urgent) {
        urgentQueueRef.current.push(index);
      } else {
        backfillQueueRef.current.push(index);
      }
      pumpQueue();
    },
    [frameCount, isQueuedOrCached, pumpQueue],
  );

  const startBackfill = useCallback(() => {
    if (backfillStartedRef.current) return;
    backfillStartedRef.current = true;

    for (let i = 0; i < frameCount; i++) {
      enqueueFrame(i, false);
    }
    if (frameCount > 1) {
      enqueueFrame(frameCount - 1, false);
    }
    pumpQueue();
  }, [enqueueFrame, frameCount, pumpQueue]);

  const evictFar = useCallback(
    (centerIndex: number) => {
      if (loadedCountRef.current < frameCount * 0.92) return;
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
    (index: number, lookahead = 0) => {
      const prev = lastRequestedRef.current;
      if (index !== prev) {
        if (index > prev) directionRef.current = 1;
        else if (index < prev) directionRef.current = -1;
        lastRequestedRef.current = index;
      }

      const dir = directionRef.current;
      const radius = Math.max(lookahead, Math.ceil(cacheWindow / 2));
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

      order.forEach((i, orderIndex) => enqueueFrame(i, orderIndex < 24));
      evictFar(index);
    },
    [cacheWindow, frameCount, enqueueFrame, evictFar],
  );

  /** Synchronous lookup for the render loop: exact frame, or nearest available. */
  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    const exact = cacheRef.current.get(index);
    if (exact?.loaded) return exact.image;

    for (let d = 1; d < 12; d++) {
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
      startBackfill();
      pumpQueue();
    }
  }, [bootTarget, firstFrameReady, initialReady, loadedCount, pumpQueue, startBackfill]);

  useEffect(() => {
    mountedRef.current = true;
    bootPhaseRef.current = true;
    backfillStartedRef.current = false;
    loadedCountRef.current = 0;
    cacheRef.current.clear();
    coldCacheRef.current.clear();
    pendingRef.current.clear();
    urgentQueueRef.current = [];
    backfillQueueRef.current = [];
    queuedSetRef.current.clear();
    lastRequestedRef.current = -1;
    lastEvictCenterRef.current = -1;
    setFirstFrameReady(false);
    setLoadedCount(0);
    setInitialReady(false);

    enqueueFrame(0, true);

    const deferBootBatch = networkProfile === "slow" ? 200 : 0;

    const bootTimer = window.setTimeout(() => {
      for (let i = 1; i < bootTarget; i++) {
        enqueueFrame(i, i < 24);
      }
      enqueueFrame(frameCount - 1, true);
    }, deferBootBatch);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(bootTimer);
    };
  }, [bootTarget, enqueueFrame, frameCount, networkProfile]);

  return {
    getFrame,
    preloadAround,
    firstFrameReady,
    loadedCount,
    bootTarget,
    initialReady,
    frameCount,
  };
}
