import { whyBellBit, whyBellBitSection, founders, teamGallery } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGallery } from "@/components/ui/TeamGallery";
import { Reveal } from "@/components/ui/Reveal";

export function WhyBellBit() {
  return (
    <section id="why-bellbit" className="relative z-10 bg-void py-28 md:py-36">
      <div className="container-edge grid gap-16 md:grid-cols-2 md:gap-20">
        <div>
          <SectionHeading
            title={whyBellBitSection.title}
            description={whyBellBitSection.description}
          />

          <ul className="mt-12 space-y-8">
            {whyBellBit.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <li className="flex gap-5 border-t border-line pt-6">
                  <span className="font-display text-sm text-paper-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium text-paper">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-paper-dim">{item.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <TeamGallery
          heroImage={teamGallery.heroImage}
          founders={founders}
          overlayTitle={teamGallery.overlayTitle}
          overlayDescription={teamGallery.overlayDescription}
        />
      </div>
    </section>
  );
}
