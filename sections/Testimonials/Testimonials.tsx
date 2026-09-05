import { testimonials } from "@/lib/testimonials";
import { TestimonialShowcase } from "@/components/ui/TestimonialShowcase";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative z-10 flex min-h-[100svh] items-center justify-center border-y border-line bg-ink py-16 md:py-20"
    >
      <div className="container-edge w-full">
        <TestimonialShowcase testimonials={testimonials} />
      </div>
    </section>
  );
}
