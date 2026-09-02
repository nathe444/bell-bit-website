"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { nav } from "@/lib/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "border border-line bg-void/70 backdrop-blur-md"
            : "border border-transparent bg-transparent"
        }`}
        aria-label="Primary"
      >
        <a href="#hero" aria-label="BellBit home" className="flex items-center">
          <BrandLogo className="h-7 w-auto" width={110} height={40} priority forceInverted={!scrolled} />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-signal-soft ${
                  scrolled ? "text-paper-dim hover:text-paper" : "text-scene-paper-dim hover:text-scene-paper"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <ThemeToggle className={!scrolled ? "border-scene-line-strong text-scene-paper-dim hover:border-signal-soft hover:text-scene-paper" : undefined} />
          <a
            href="#contact"
            className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:border-signal-soft hover:text-signal-soft ${
              scrolled
                ? "border-line-strong text-paper"
                : "border-scene-line-strong text-scene-paper hover:text-scene-paper"
            }`}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
