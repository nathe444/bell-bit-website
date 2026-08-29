import { contact } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const placeholderSlots = [1, 2, 3];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 bg-void py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say, in their own words."
          description={contact.referencesNote}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {placeholderSlots.map((slot, index) => (
            <Reveal key={slot} delay={index * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-line-strong bg-surface p-8">
                <div>
                  <span className="font-display text-4xl text-paper-faint">&ldquo;</span>
                  <p className="mt-2 text-paper-faint italic">
                    Testimonial pending — a client quote will be added here once
                    collected.
                  </p>
                </div>
                <div className="mt-8 border-t border-line pt-4 text-xs uppercase tracking-[0.2em] text-paper-faint">
                  Client name &amp; company — pending
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
