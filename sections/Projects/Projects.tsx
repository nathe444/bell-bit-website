import { projects } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectStage } from "./ProjectStage";

export function Projects() {
  return (
    <section id="projects" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Featured Projects"
          title="One engineering capability. Different systems."
          description="The same process — understand, design, architect, build, deploy — produces very different software depending on the problem."
        />
      </div>

      <div className="mt-16 md:mt-20">
        <ProjectStage projects={projects} />
      </div>
    </section>
  );
}
