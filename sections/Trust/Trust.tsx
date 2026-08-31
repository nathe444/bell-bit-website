import { clients, partners, trustSection } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RegistryBlock } from "./RegistryBlock";
import { RegistryPanel } from "./RegistryPanel";

export function Trust() {
  return (
    <section
      id="trust"
      className="relative z-10 border-y border-line bg-void pt-20 pb-24 md:pt-24 md:pb-28"
    >
      <div className="container-edge">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] md:gap-16 lg:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <Reveal>
              <SectionHeading
                eyebrow={trustSection.eyebrow}
                title={trustSection.title}
                description={trustSection.description}
              />
            </Reveal>
          </div>

          <RegistryPanel>
            <RegistryBlock
              title="Clients"
              variant="client"
              entries={clients}
              idPrefix="C"
            />
            <RegistryBlock
              title="Partners"
              variant="partner"
              entries={partners}
              idPrefix="P"
              subordinate
            />
          </RegistryPanel>
        </div>
      </div>
    </section>
  );
}
