"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

function resolveNavHref(href: string, isHome: boolean) {
  if (href.startsWith("/#")) {
    return isHome ? href.slice(1) : href;
  }
  if (href.startsWith("#")) {
    return isHome ? href : `/${href}`;
  }
  return href;
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const logoAppearance = isHome && !scrolled ? "on-dark-scene" : "default";
  const useSolidNav = !isHome || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        useSolidNav ? "pt-3 sm:pt-4" : "pt-4 sm:pt-6",
      )}
    >
      <nav
        data-over-hero={isHome && !scrolled ? true : undefined}
        className={cn(
          "grid w-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          useSolidNav
            ? "max-w-4xl border border-line bg-void/80 px-4 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)]"
            : "max-w-5xl border border-transparent bg-transparent px-5 py-3",
        )}
        aria-label="Primary"
      >
        <Link
          href={isHome ? "#hero" : "/"}
          aria-label="BellBit home"
          className={cn(
            "relative flex shrink-0 items-center justify-self-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            useSolidNav ? "h-6 w-6" : "h-7 w-[7.5rem] sm:h-8",
          )}
        >
          <span
            className={cn(
              "block transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              useSolidNav ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100",
            )}
            aria-hidden={useSolidNav}
          >
            <BrandLogo
              variant="full"
              appearance={logoAppearance}
              className="h-7 w-auto sm:h-8"
              width={110}
              height={40}
              priority
            />
          </span>

          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              useSolidNav ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
            )}
            aria-hidden={!useSolidNav}
          >
            <BrandLogo
              variant="mark"
              appearance={logoAppearance}
              className="h-6 w-6"
              width={110}
              height={40}
              priority
            />
          </span>
        </Link>

        <ul className="hidden items-center gap-8 justify-self-center md:flex">
          {nav.map((item) => {
            const href = resolveNavHref(item.href, isHome);
            const isPageLink = href.startsWith("/") && !href.startsWith("/#");
            const className = cn(
              "text-xs font-bold uppercase tracking-[0.2em] transition-colors",
              useSolidNav
                ? "text-paper-dim hover:text-paper"
                : "text-white/80 hover:text-white",
            );

            return (
              <li key={item.href}>
                {isPageLink ? (
                  <Link href={href} className={className}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={href} className={className}>
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <div className="col-start-2 flex items-center justify-self-end md:col-start-3">
          <ThemeToggle
            className={
              useSolidNav
                ? "border-line-strong text-paper-dim hover:border-signal-soft hover:text-paper"
                : "border-white/30 text-white/80 hover:border-white/50 hover:text-white"
            }
          />
        </div>
      </nav>
    </header>
  );
}
