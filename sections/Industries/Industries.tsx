import { industries } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustriesGrid } from "./IndustriesGrid";

export function Industries() {
  return (
    <section id="industries" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Different environments. The same engineering discipline."
        />

        <IndustriesGrid industries={industries} />
      </div>
    </section>
  );
}
