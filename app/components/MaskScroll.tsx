"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hotel } from "../lib/content";
import { ChevronDown } from "./icons";
import Hero from "./Hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The FULLMAN letters are knocked *out* of a solid frame so you look
   straight through them at the Hero behind — the letters are clear
   windows, not filled with their own video.

   The frame div paints a solid page-colour rect, then two mask layers are
   composited with `exclude` (a.k.a. webkit `xor`):
     • a flat gradient — opaque everywhere, so the whole rect is kept, and
     • the wordmark SVG — opaque only on the glyphs.
   `exclude` keeps whatever is in exactly one layer, so the rect survives
   everywhere except the glyphs, which get punched out to full transparency.
   A heavy system sans keeps the cut razor-sharp with no embedded webfont.

   Rendered letter size is font-size ÷ viewBox width × the CSS mask width —
   seven letters on one line are width-bound on any normal (< ~2:1) screen,
   so there's a hard ceiling on how tall they can get before "FULLMAN"
   itself clips against the viewBox at the edges (F and N first). This is
   tuned right up against that ceiling without crossing it; the tagline
   below fills the vertical space that's structurally left over, rather
   than leaving it empty. */
const MASK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'>` +
    `<text x='50%' y='53%' text-anchor='middle' dominant-baseline='middle' ` +
    `font-family='Arial, Helvetica, sans-serif' font-weight='800' ` +
    `font-size='320' letter-spacing='-4' fill='white'>${hotel.wordmark}</text>` +
    `</svg>`,
)}`;

const knockoutMask = {
  WebkitMaskImage: `url("${MASK_SVG}"), linear-gradient(#000, #000)`,
  maskImage: `url("${MASK_SVG}"), linear-gradient(#000, #000)`,
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskPosition: "center, center",
  maskPosition: "center, center",
  WebkitMaskSize: "min(95vw, 91rem) auto, 100% 100%",
  maskSize: "min(95vw, 91rem) auto, 100% 100%",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  willChange: "transform, opacity",
} as React.CSSProperties;

export default function MaskScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  // Pin target is a child of the #top section, not the section itself —
  // pinning wraps its target in a pin-spacer, which throws off where a
  // plain `href="#top"` anchor jump lands once the page has scrolled past
  // it. Keeping the id on the unpinned outer section keeps that anchor
  // accurate.
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !pinRef.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=110%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
        },
        defaults: { ease: "none" },
      });

      // The Hero copy is the first thing the visitor reads; it gradually
      // disappears as they scroll, so nothing lingers half-legible once the
      // frame closes in.
      tl.fromTo(".hero-copy", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.55 }, 0);

      // The framed window closes in over the Hero and resolves onto the
      // wordmark — the reverse of the old zoom-in. It starts fully clear so
      // the visitor first sees the untouched Hero, then the frame fades in
      // and shrinks into place around the letters.
      tl.fromTo(frameRef.current, { scale: 2.2 }, { scale: 1, duration: 1 }, 0);
      tl.fromTo(
        frameRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.85 },
        0,
      );

      // Scroll cue resolves in last, once the window settles. Ends exactly
      // at the timeline's end (duration 1) so the pin never holds on a
      // static, unchanging frame while still consuming scroll input.
      tl.fromTo(
        ".mask-caption",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25 },
        0.75,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative w-full bg-noir">
      <div
        ref={pinRef}
        className="relative flex min-h-svh w-full items-center justify-center overflow-hidden"
      >
        {/* The scene the visitor lands on. It stays put and is what shows
            through the letters once the frame closes over it. `isolate`
            keeps the Hero's internal z-10 content trapped in its own
            stacking context, so it stays *behind* the frame instead of
            escaping on top of it. */}
        <div className="absolute inset-0 isolate">
          <Hero />
        </div>

        {/* Frame in the page colour with the FULLMAN letters punched clean
            out of it. Starts hidden (opacity-0) so no-JS / reduced-motion
            simply shows the Hero; pointer-events-none so it never swallows
            clicks meant for the Hero's buttons. */}
        <div
          ref={frameRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-noir opacity-0"
          style={knockoutMask}
        />

        {/* Tagline — fills the space below the letters (a 7-letter wordmark
            on one line can only get so tall before it clips, so there's
            always a band left over under it) instead of leaving it empty. */}
        <p className="mask-caption absolute top-[64%] left-1/2 -translate-x-1/2 text-center font-serif text-lg text-cream/80 opacity-0 sm:text-xl">
          {hotel.tagline}
        </p>

        {/* Scroll cue */}
        <a
          href="#about"
          aria-label="Scroll to explore"
          className="mask-caption absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/70 opacity-0 transition-colors hover:text-gold"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
