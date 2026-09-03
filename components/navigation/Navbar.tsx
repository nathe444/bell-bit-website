"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoAppearance = scrolled ? "default" : "on-dark-scene";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled ? "pt-3 sm:pt-4" : "pt-4 sm:pt-6",
      )}
    >
      <nav
        className={cn(
          "grid w-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "max-w-4xl border border-line bg-void/80 px-4 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)]"
            : "max-w-5xl border border-transparent bg-transparent px-5 py-3",
        )}
        aria-label="Primary"
      >
        <a
          href="#hero"
          aria-label="BellBit home"
          className={cn(
            "relative flex shrink-0 items-center justify-self-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "h-6 w-6" : "h-7 w-[7.5rem] sm:h-8",
          )}
        >
          <span
            className={cn(
              "block transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100",
            )}
            aria-hidden={scrolled}
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
              scrolled ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
            )}
            aria-hidden={!scrolled}
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
        </a>

        <ul className="hidden items-center gap-8 justify-self-center md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-signal-soft",
                  scrolled
                    ? "text-paper-dim hover:text-paper"
                    : "text-scene-paper-dim hover:text-scene-paper",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-2 flex items-center gap-2 justify-self-end sm:gap-3 md:col-start-3">
          <ThemeToggle
            className={
              scrolled
                ? undefined
                : "border-scene-line-strong text-scene-paper-dim hover:border-signal-soft hover:text-scene-paper"
            }
          />
          <a
            href="#contact"
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 hover:border-signal-soft hover:text-signal-soft sm:px-4 sm:py-2",
              scrolled
                ? "border-line-strong text-paper"
                : "border-scene-line-strong text-scene-paper hover:text-scene-paper",
            )}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
