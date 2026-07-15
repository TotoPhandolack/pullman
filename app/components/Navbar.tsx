"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { navLinks, hotel } from "../lib/content";
import { MenuIcon, CloseIcon } from "./icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line/70 bg-noir/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-3 font-serif text-xl font-semibold tracking-[0.35em] text-cream sm:text-2xl"
        >
          {hotel.wordmark}
          <Image
            src="/assets/images/fullman.png"
            alt={`${hotel.name} logo`}
            width={54}
            height={40}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm tracking-wide text-cream/85 transition-colors hover:text-gold"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-medium text-noir transition-colors hover:bg-gold-soft sm:inline-block"
          >
            Book Now
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line/60 bg-noir/95 backdrop-blur-md transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base tracking-wide text-cream/90 transition-colors hover:bg-surface-2 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="px-3 pt-2">
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold px-5 py-3 text-center text-sm font-medium text-noir"
            >
              Book Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
