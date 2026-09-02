import Image from "next/image";

export type MarqueeEntry = {
  name: string;
  logo: string | null;
};

function monogram(name: string) {
  const letter = name.trim().charAt(0).toUpperCase();
  return letter || "?";
}

type MarqueeItemProps = {
  entry: MarqueeEntry;
};

export function MarqueeItem({ entry }: MarqueeItemProps) {
  return (
    <div className="flex w-[7.5rem] shrink-0 flex-col items-center gap-3 text-center sm:w-[8.5rem] md:w-[10rem] md:gap-4 lg:w-[11rem]">
      <div className="relative flex h-12 w-16 items-center justify-center md:h-14 md:w-20 lg:h-16 lg:w-24">
        {entry.logo ? (
          <Image
            src={entry.logo}
            alt=""
            fill
            className="object-contain brightness-110 contrast-[1.08] saturate-[1.15] transition-transform duration-300 group-hover/item:scale-105"
            sizes="96px"
          />
        ) : (
          <span
            className="font-display text-xl font-semibold text-signal-soft md:text-2xl"
            aria-hidden="true"
          >
            {monogram(entry.name)}
          </span>
        )}
      </div>
      <span className="text-balance text-sm font-medium leading-snug tracking-wide text-paper transition-colors duration-300 group-hover/item:text-signal-soft md:text-base">
        {entry.name}
      </span>
    </div>
  );
}
