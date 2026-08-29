"use client";

import { useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  strength?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * A restrained magnetic-hover effect: the element nudges toward the cursor
 * within its own bounds, then eases back. Disabled on touch devices, where
 * there is no hover concept to respond to.
 */
export function MagneticButton<T extends ElementType = "a">({
  as,
  children,
  strength = 0.35,
  className,
  ...props
}: MagneticButtonProps<T>) {
  const ref = useRef<HTMLElement | null>(null);
  const Component = (as ?? "a") as ElementType;

  const handlePointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
  };

  const handlePointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <Component
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      style={{ transition: "transform 0.4s var(--ease-signature)" }}
      {...props}
    >
      {children}
    </Component>
  );
}
