import { industries } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Industries() {
  return (
    <section id="industries" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Different environments. The same engineering discipline."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <Reveal key={industry.id} delay={index * 0.04} className="bg-void p-8">
              <h3 className="font-display text-xl font-medium text-paper">{industry.name}</h3>
              <p className="mt-3 text-sm text-paper-dim">{industry.description}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-signal-soft">
                Seen in {industry.project}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
