import { BrandLogo } from "@/components/brand/BrandLogo";
import { company, contact, nav } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="@container/size relative z-10 overflow-hidden border-t border-line bg-ink py-8 sm:py-10 md:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
      >
        <span
          className="max-w-full font-display text-[length:min(80cqh,calc(100cqw/4.05))] font-medium leading-none tracking-[-0.02em] text-paper/[0.045] select-none whitespace-nowrap sm:text-[length:min(78cqh,16rem)] md:text-[length:min(84cqh,26rem)] md:tracking-[-0.03em]"
        >
          {company.shortName}
        </span>
      </div>

      <div className="container-edge relative z-10 flex flex-col gap-8 sm:gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="max-w-xs">
          <BrandLogo className="h-8 w-auto sm:h-9" width={140} height={52} />
          <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-paper-faint sm:mt-4">
            {company.footerBlurb}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:flex sm:flex-wrap sm:gap-12 md:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-paper-faint">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-paper-dim hover:text-paper">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-paper-faint">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm text-paper-dim">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-paper">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phonePrimary}`} className="hover:text-paper">
                  {contact.phonePrimary}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-edge relative z-10 mt-8 pt-0 text-[11px] leading-relaxed text-paper-faint sm:mt-10 sm:text-xs md:mt-12">
        <span className="text-balance">
          © {year} {company.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
