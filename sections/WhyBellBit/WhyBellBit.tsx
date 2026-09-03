import Image from "next/image";
import { whyBellBit, whyBellBitSection, team, company } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

        <Reveal delay={0.1} className="flex flex-col">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <Image
              src="/assets/bellbit/team/office.jpeg"
              alt={`${team.size} people from the BellBit team collaborating at their office`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <p className="mt-6 text-paper-dim">{team.description}</p>
          <p className="mt-4 text-sm text-paper-faint">
            {company.shortName} today — {team.size} engineers, designers, and solution
            architects, grown from an original team of three.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
