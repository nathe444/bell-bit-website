import { testimonials, testimonialsSection } from "@/lib/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerTestimonials } from "@/components/ui/StaggerTestimonials";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 bg-void py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow={testimonialsSection.eyebrow}
          title={testimonialsSection.title}
        />

        <StaggerTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}
