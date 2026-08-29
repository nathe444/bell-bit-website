import { technologies } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const layers = [
  { id: "experience", label: "Experience", items: technologies.frontend },
  { id: "applications", label: "Applications", items: technologies.mobile },
  { id: "services", label: "Services", items: technologies.backend },
  { id: "architecture", label: "Architecture", items: technologies.platform.slice(1) },
  { id: "infrastructure", label: "Infrastructure", items: technologies.platform.slice(0, 1) },
] as const;

export function Technology() {
  return (
    <section id="technology" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Technology Stack"
          title="Depth at every layer, not a wall of logos."
          description="Each technology sits where it does the most work — from what a user touches down to what keeps a system running."
        />

        <div className="mt-16 overflow-hidden rounded-2xl border border-line">
          {layers.map((layer, index) => (
            <Reveal key={layer.id} delay={index * 0.05}>
              <div
                className={`flex flex-col gap-3 border-line px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 ${
                  index !== layers.length - 1 ? "border-b" : ""
                }`}
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-signal) ${
                    4 + index * 2
                  }%, var(--color-surface))`,
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xs text-paper-faint">
                    0{index + 1}
                  </span>
                  <span className="font-display text-lg font-medium text-paper">
                    {layer.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-paper-dim"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
