import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="text-balance font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight text-paper">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-balance text-base leading-relaxed text-paper-dim md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
