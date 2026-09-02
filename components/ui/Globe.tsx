"use client";

import { useEffect, useRef, useCallback, type CSSProperties } from "react";
import createGlobe from "cobe";
import { useTheme } from "next-themes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type GlobeMarker = {
  id: string;
  location: [number, number];
  label: string;
};

export type GlobeArc = {
  id: string;
  from: [number, number];
  to: [number, number];
  label?: string;
};

type GlobeProps = {
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
  className?: string;
};

export function Globe({ markers = [], arcs = [], className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const markerColor: [number, number, number] = isDark ? [0.35, 0.55, 0.98] : [0.15, 0.39, 0.92];
  const baseColor: [number, number, number] = isDark ? [0.16, 0.19, 0.26] : [0.96, 0.97, 0.99];
  const arcColor: [number, number, number] = isDark ? [0.35, 0.55, 0.98] : [0.24, 0.49, 0.92];
  const glowColor: [number, number, number] = isDark ? [0.12, 0.14, 0.19] : [0.92, 0.94, 0.98];
  const dark = isDark ? 1 : 0;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current === null) return;

    const deltaX = e.clientX - pointerInteracting.current.x;
    const deltaY = e.clientY - pointerInteracting.current.y;
    dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 };

    const now = Date.now();
    if (lastPointer.current) {
      const dt = Math.max(now - lastPointer.current.t, 1);
      const maxVelocity = 0.15;
      velocity.current = {
        phi: Math.max(
          -maxVelocity,
          Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.3)
        ),
        theta: Math.max(
          -maxVelocity,
          Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)
        ),
      };
    }
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      lastPointer.current = null;
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;
    const speed = reducedMotion ? 0 : 0.003;

    const buildState = () => ({
      phi: phi + phiOffsetRef.current + dragOffset.current.phi,
      theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      dark,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: isDark ? 8 : 10,
      baseColor,
      markerColor,
      glowColor,
      arcColor,
      markerElevation: 0.01,
      markerSize: 0.025,
      arcWidth: 0.5,
      arcHeight: 0.25,
      opacity: 0.85,
      markers: markers.map((m) => ({
        location: m.location,
        size: 0.025,
      })),
      arcs: arcs.map((a) => ({
        from: a.from,
        to: a.to,
      })),
    });

    function init() {
      const width = canvas!.offsetWidth;
      if (width === 0 || globe) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas!, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        ...buildState(),
      });

      const animate = () => {
        if (!globe) return;

        if (!isPausedRef.current && !reducedMotion) {
          phi += speed;
          if (
            Math.abs(velocity.current.phi) > 0.0001 ||
            Math.abs(velocity.current.theta) > 0.0001
          ) {
            phiOffsetRef.current += velocity.current.phi;
            thetaOffsetRef.current += velocity.current.theta;
            velocity.current.phi *= 0.95;
            velocity.current.theta *= 0.95;
          }

          const thetaMin = -0.4;
          const thetaMax = 0.4;
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1;
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1;
          }
        }

        globe.update(buildState());
        animationId = requestAnimationFrame(animate);
      };

      animate();
      canvas!.style.opacity = "1";
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(animationId);
      globe?.destroy();
    };
  }, [
    markers,
    arcs,
    markerColor,
    baseColor,
    arcColor,
    glowColor,
    dark,
    isDark,
    reducedMotion,
  ]);

  return (
    <div
      className={`relative aspect-square w-full select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="h-full w-full touch-none opacity-0 transition-opacity duration-[1200ms] ease-out"
        style={{ cursor: "grab", borderRadius: "50%" }}
        aria-hidden="true"
      />
      {markers.map((m) => (
        <div
          key={m.id}
          className="pointer-events-none absolute whitespace-nowrap rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-paper shadow-sm"
          style={{
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 8,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
          } as CSSProperties}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}
