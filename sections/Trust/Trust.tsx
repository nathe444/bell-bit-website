import Image from "next/image";
import { clients, partners } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

type Entity = { name: string; logo: string | null };

/** Real logos where the source document had them; an honest wordmark otherwise — never a fabricated mark. */
function EntityRow({ entities }: { entities: readonly Entity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {entities.map((entity) => (
        <li
          key={entity.name}
          className="flex h-24 items-center justify-center rounded-lg border border-line px-6 py-4 transition-colors hover:border-line-strong"
        >
          {entity.logo ? (
            <div className="relative h-12 w-full">
              <Image
                src={entity.logo}
                alt={entity.name}
                fill
                className="object-contain grayscale opacity-80 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                sizes="200px"
              />
            </div>
          ) : (
            <span className="text-center text-sm font-medium text-paper-dim">
              {entity.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Trust() {
  return (
    <section id="trust" className="relative z-10 border-y border-line py-24">
      <div className="container-edge">
        <Reveal>
          <p className="mb-12 text-center text-xs font-medium uppercase tracking-[0.3em] text-paper-faint">
            Clients &amp; Partners
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <EntityRow entities={clients} />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 border-t border-line pt-10">
          <EntityRow entities={partners} />
        </Reveal>
      </div>
    </section>
  );
}
