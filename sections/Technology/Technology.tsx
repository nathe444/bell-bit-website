import { technologyGroups, technologySection } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnologyStage } from "./TechnologyStage";

export function Technology() {
  return (
    <section id="technology" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={technologySection.eyebrow}
          title={technologySection.title}
          description={technologySection.description}
        />
      </div>

      <div className="mt-12 md:mt-16">
        <TechnologyStage groups={technologyGroups} />
      </div>
    </section>
  );
}
