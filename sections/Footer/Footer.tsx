import { BrandLogo } from "@/components/brand/BrandLogo";
import { company, contact, nav } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-ink py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden"
      >
        <span className="block w-[88%] max-w-none translate-y-[12%] text-center font-display text-[clamp(10rem,25vw,35rem)] font-medium leading-[0.85] tracking-[-0.03em] text-paper/[0.045] select-none whitespace-nowrap">
          {company.shortName}
        </span>
      </div>

      <div className="container-edge relative z-10 flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <BrandLogo className="h-9 w-auto" width={140} height={52} />
          <p className="mt-4 max-w-[16rem] text-xs leading-relaxed text-paper-faint">
            {company.footerBlurb}
          </p>
        </div>

        <div className="flex flex-wrap gap-16">
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
              <li>
                <a href={`tel:${contact.phoneSecondary}`} className="hover:text-paper">
                  {contact.phoneSecondary}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-edge relative z-10 mt-14 pt-6 text-xs text-paper-faint">
        <span>
          © {year} {company.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
