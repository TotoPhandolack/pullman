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

/* Shared with the tagline's position below — see the calc() there for why. */
const MASK_WIDTH = "min(68vw, 56rem)";

const knockoutMask = {
  WebkitMaskImage: `url("${MASK_SVG}"), linear-gradient(#000, #000)`,
  maskImage: `url("${MASK_SVG}"), linear-gradient(#000, #000)`,
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskPosition: "center, center",
  maskPosition: "center, center",
  WebkitMaskSize: `${MASK_WIDTH} auto, 100% 100%`,
  maskSize: `${MASK_WIDTH} auto, 100% 100%`,
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  willChange: "transform, opacity",
} as React.CSSProperties;

/* The letters are centred (mask-position 50% 50%) and their rendered
   height is MASK_WIDTH / 4 (the SVG's 4:1 viewBox), so their bottom edge
   sits at 50% + MASK_WIDTH/8 from the top of the pinned scene. Deriving
   the tagline's position from that same expression — instead of a guessed
   percentage — keeps it sitting right under the letters at every viewport
   size, rather than leaving a gap that only happened to look right on the
   one screen it was tuned against. */
const taglineStyle: React.CSSProperties = {
  top: `calc(50% + (${MASK_WIDTH}) / 8 + 1rem)`,
};

/* Same derivation, offset further down to clear the tagline's own line
   height — keeps the scroll cue part of the same cohesive group instead
   of stranded near the bottom of the viewport with dead space in between. */
const scrollCueStyle: React.CSSProperties = {
  top: `calc(50% + (${MASK_WIDTH}) / 8 + 5rem)`,
};

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
          end: "+=85%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
        },
        defaults: { ease: "none" },
      });

      // The Hero copy is the first thing the visitor reads. It finishes
      // fading out *before* the frame becomes noticeably opaque (below) —
      // sequential, not overlapping — so there's no stretch of scroll where
      // Hero text and the FULLMAN letters are both half-visible at once,
      // fighting each other for legibility.
      tl.fromTo(".hero-copy", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0);

      // The framed window closes in over the Hero and resolves onto the
      // wordmark — the reverse of the old zoom-in. Scale runs the whole
      // time (it's what makes the reveal feel like a zoom), but opacity
      // only starts ramping up once the Hero copy is nearly gone, so the
      // letters resolve cleanly instead of emerging through leftover text.
      tl.fromTo(frameRef.current, { scale: 2.2 }, { scale: 1, duration: 1 }, 0);
      tl.fromTo(
        frameRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.55 },
        0.25,
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

        {/* Tagline — sits right under the letters (position derived from
            the same width expression as the mask, see taglineStyle) so it
            fills that space instead of leaving it empty, at any viewport
            size. */}
        <p
          style={taglineStyle}
          className="mask-caption absolute left-1/2 -translate-x-1/2 text-center font-serif text-lg text-cream/80 opacity-0 sm:text-xl"
        >
          {hotel.tagline}
        </p>

        {/* Scroll cue — grouped with the tagline (see scrollCueStyle) rather
            than pinned to the viewport's bottom edge, so it doesn't strand
            itself far below with empty space in between. */}
        <a
          href="#about"
          aria-label="Scroll to explore"
          style={scrollCueStyle}
          className="mask-caption absolute left-1/2 z-10 -translate-x-1/2 text-cream/70 opacity-0 transition-colors hover:text-gold"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
