import Image from "next/image";
import Link from "next/link";

type RegistryRowProps = {
  registryId: string;
  name: string;
  label: string;
  logo: string | null;
  projectId?: string | null;
  variant?: "client" | "partner";
};

function monogram(name: string) {
  const letter = name.trim().charAt(0).toUpperCase();
  return letter || "?";
}

export function RegistryRow({
  registryId,
  name,
  label,
  logo,
  projectId,
  variant = "client",
}: RegistryRowProps) {
  const isPartner = variant === "partner";
  const nameClass = isPartner
    ? "text-sm font-medium text-paper-dim group-hover:text-paper"
    : "font-medium text-paper-dim group-hover:text-paper";

  const nameInner = projectId ? (
    <Link
      href="#projects"
      className={`${nameClass} underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-signal`}
    >
      {name}
    </Link>
  ) : (
    <span className={nameClass}>{name}</span>
  );

  return (
    <li
      className="registry-row group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line py-4 md:grid-cols-[3rem_1fr_7rem_2.5rem] md:gap-x-6 md:py-5"
    >
      <span className="font-mono text-[10px] tracking-wider text-paper-faint md:text-xs">
        {registryId}
      </span>

      <div className="col-span-2 flex min-w-0 flex-col gap-1 md:col-span-1 md:contents">
        <div className="min-w-0 md:col-start-2">{nameInner}</div>
        <span
          className={`uppercase tracking-[0.2em] text-paper-faint md:col-start-3 md:text-right ${
            isPartner ? "text-[10px]" : "text-xs"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-end md:col-start-4">
        {logo ? (
          <div className="relative h-8 w-10 opacity-70 transition-opacity group-hover:opacity-100 md:h-9 md:w-11">
            <Image
              src={logo}
              alt=""
              fill
              className="object-contain object-right"
              sizes="44px"
            />
          </div>
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center font-display text-sm font-semibold text-signal-soft/80 transition-colors group-hover:text-signal-soft md:h-9 md:w-9 md:text-base"
            aria-hidden="true"
          >
            {monogram(name)}
          </span>
        )}
      </div>
    </li>
  );
}
