import { cn } from "@/lib/utils";

type HeroSecondaryCopyProps = {
  text: string;
  size?: "animated" | "static";
};

export function HeroSecondaryCopy({ text, size = "animated" }: HeroSecondaryCopyProps) {
  return (
    <p
      className={cn(
        "text-balance font-hero-secondary font-medium leading-[1.06] tracking-[-0.02em] text-scene-paper",
        size === "animated"
          ? "text-[clamp(1.875rem,4.4vw,3.4rem)]"
          : "text-[clamp(1.4rem,3.2vw,2.45rem)]",
      )}
    >
      {text}
    </p>
  );
}
