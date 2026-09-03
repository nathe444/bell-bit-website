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
        <span className="translate-y-[18%] font-display text-[clamp(6rem,28vw,18rem)] font-medium leading-[0.85] tracking-[-0.04em] text-paper/[0.045] select-none">
          {company.shortName}
        </span>
      </div>

      <div className="container-edge relative z-10 flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <BrandLogo className="h-9 w-auto" width={140} height={52} />
          <p className="mt-5 text-sm text-paper-dim">{company.overview}</p>
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

      <div className="container-edge relative z-10 mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-paper-faint sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {company.name}. All rights reserved.
        </span>
        <span>Founded {company.founded} · Licensed {company.licensed}</span>
      </div>
    </footer>
  );
}
