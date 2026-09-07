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
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem]">
        {entry.logo ? (
          <div className="relative h-full w-full">
            <Image
              src={entry.logo}
              alt=""
              fill
              className="object-contain object-center transition-transform duration-300 group-hover/item:scale-[1.03]"
              sizes="(max-width: 768px) 56px, 72px"
            />
          </div>
        ) : (
          <span
            className="font-display text-xl font-semibold text-signal md:text-2xl"
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
