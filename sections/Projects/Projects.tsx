import { projects, projectsSection } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectStage } from "./ProjectStage";

export function Projects() {
  return (
    <section id="projects" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow={projectsSection.eyebrow}
          title={projectsSection.title}
          description={projectsSection.description}
        />
      </div>

      <div className="mt-10 md:mt-20">
        <ProjectStage projects={projects} />
      </div>
    </section>
  );
}
