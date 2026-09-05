import { services } from "@/lib/content";
import { ServiceIcon } from "./ServiceIcon";

type Service = (typeof services)[number];

export function ServicesModuleList() {
  return (
    <ul className="flex list-none flex-col gap-2.5 p-0 md:gap-2 lg:gap-2.5" aria-label="Services">
      {services.map((service) => (
        <ServiceRow key={service.id} service={service} />
      ))}
    </ul>
  );
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-line/50 bg-surface/25 transition-all duration-300 hover:border-signal-soft/35 hover:bg-surface/45 hover:shadow-[0_12px_40px_-20px_rgba(37,99,235,0.35)] dark:hover:shadow-[0_12px_40px_-20px_rgba(77,132,247,0.4)]">
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-signal-soft transition-transform duration-500 group-hover:scale-y-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-signal-soft/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4 p-3.5 md:gap-4 md:px-4 md:py-3 lg:px-5 lg:py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-void/40 text-signal-soft transition-all duration-300 group-hover:border-signal-soft/45 group-hover:bg-signal-dim md:h-11 md:w-11">
          <ServiceIcon id={service.id} className="h-[1.125rem] w-[1.125rem] md:h-5 md:w-5" />
        </div>

        <p className="min-w-0 flex-1 font-display text-base font-medium leading-snug text-paper transition-colors duration-300 group-hover:text-paper md:text-lg lg:whitespace-nowrap lg:text-xl">
          {service.title}
        </p>

        <span
          className="shrink-0 -translate-x-1 font-mono text-sm text-paper-faint opacity-0 transition-[opacity,transform,color] duration-300 group-hover:translate-x-0 group-hover:text-signal-soft group-hover:opacity-100"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </li>
  );
}
