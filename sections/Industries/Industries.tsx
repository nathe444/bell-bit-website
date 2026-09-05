import { industries } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { IndustriesGrid } from "./IndustriesGrid";

export function Industries() {
  return (
    <section id="industries" className="relative z-10 bg-ink pt-10 pb-28 md:pt-14 md:pb-36">
      <div className="container-edge">
        <Reveal>
          <h2 className="max-w-3xl text-balance font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.05] text-paper">
            Industries We Serve
          </h2>
        </Reveal>

        <IndustriesGrid industries={industries} />
      </div>
    </section>
  );
}
