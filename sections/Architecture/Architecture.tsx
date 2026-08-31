import { architectureStages } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArchitecturePipeline } from "./ArchitecturePipeline";

export function Architecture() {
  return (
    <section id="architecture" className="relative z-10 border-t border-line bg-void py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Architectural Advancement"
          title="A problem becomes a system through a fixed sequence of decisions."
          description="This is the level BellBit works at: not just writing code, but deciding how a system is structured before a line of it exists."
        />

        <ArchitecturePipeline stages={architectureStages} />
      </div>
    </section>
  );
}
