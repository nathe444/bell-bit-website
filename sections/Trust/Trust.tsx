import { clients, partners, trustSection } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueeRow } from "./MarqueeRow";

export function Trust() {
  return (
    <section
      id="trust"
      className="relative z-10 overflow-x-hidden border-y border-line bg-void py-20 md:py-28"
    >
      <div className="container-edge">
        <Reveal>
          <SectionHeading
            eyebrow={trustSection.eyebrow}
            title={trustSection.title}
            description={trustSection.description}
            align="center"
          />
        </Reveal>
      </div>

      <div className="mt-14 md:mt-20">
        <MarqueeRow
          label="Clients"
          directionLabel="←"
          entries={clients}
          direction="left"
          durationSeconds={58}
        />

        <div
          className="mx-auto my-12 max-w-3xl px-6 md:my-20"
          aria-hidden="true"
        >
          <div className="h-px w-full bg-line" />
        </div>

        <MarqueeRow
          label="Partners"
          directionLabel="→"
          entries={partners}
          direction="right"
          durationSeconds={74}
        />
      </div>
    </section>
  );
}
