"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * A restrained custom cursor for precision-pointer (desktop) devices only.
 * Grows subtly over interactive elements. Never renders on touch devices —
 * there is no hover concept to enhance there.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const enabled = useMediaQuery("(pointer: fine)");
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      const el = dotRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [data-cursor-hover]")));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference transition-[width,height] duration-200 ease-out"
      style={{
        width: hovering ? 36 : 8,
        height: hovering ? 36 : 8,
        backgroundColor: "#f3f5fa",
      }}
    />
  );
}
