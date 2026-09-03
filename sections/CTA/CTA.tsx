import Image from "next/image";
import { contact } from "@/lib/content";
import { heroSequence } from "@/sections/Hero/hero.config";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CTA() {
  return (
    <section id="contact" className="relative z-10 overflow-hidden bg-void py-32 md:py-44">
      <Image
        src={heroSequence.framePath(heroSequence.frameCount - 1)}
        alt=""
        fill
        aria-hidden="true"
        className="object-cover cta-media-opacity"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />

      <div className="container-edge relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
            Let&rsquo;s Work Together
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-balance font-display text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.02] text-paper">
            Let&rsquo;s build the next one.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <MagneticButton
            as="a"
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-3 rounded-full bg-signal px-8 py-4 text-sm font-semibold uppercase tracking-wide text-on-signal"
          >
            {contact.email}
          </MagneticButton>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-paper-dim">
          <a href={`tel:${contact.phonePrimary}`} className="hover:text-paper">
            {contact.phonePrimary}
          </a>
          <span className="hidden text-paper-faint sm:inline">/</span>
          <a href={`tel:${contact.phoneSecondary}`} className="hover:text-paper">
            {contact.phoneSecondary}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
