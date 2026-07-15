"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hotel, heroPoster } from "../lib/content";
import { ChevronDown } from "./icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The wordmark is masked onto the hero video via CSS mask-image. This
   browser's mask compositing keys off alpha, not luminance — an opaque
   background rect (even filled black) would make alpha 1 everywhere and
   defeat the mask entirely, so the SVG must leave the area outside the
   text fully transparent (no background rect at all). A heavy system
   sans is used instead of the site serif so the mask stays razor-sharp —
   no webfont has to be embedded inside the data URI for it to render. */
const MASK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'>` +
    `<text x='50%' y='53%' text-anchor='middle' dominant-baseline='middle' ` +
    `font-family='Arial, Helvetica, sans-serif' font-weight='800' ` +
    `font-size='300' letter-spacing='4' fill='white'>${hotel.wordmark}</text>` +
    `</svg>`,
)}`;

export default function MaskScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  // Pin target is a child of the #top section, not the section itself —
  // pinning wraps its target in a pin-spacer, which throws off where a
  // plain `href="#top"` anchor jump lands once the page has scrolled past
  // it. Keeping the id on the unpinned outer section keeps that anchor
  // accurate.
  const pinRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !pinRef.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        },
      })
        .fromTo(
          ".mask-caption",
          { opacity: 1 },
          { opacity: 0, duration: 0.25, ease: "none" },
          0,
        )
        .fromTo(
          wrapRef.current,
          { scale: 1, xPercent: 0 },
          { scale: 3.2, xPercent: -6, ease: "none", duration: 1 },
          0,
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
        {/* Ambient backdrop so the space around the letterforms reads as
            the same moody footage, not a flat void, before the mask zooms
            in. */}
        <video
          src="/assets/video/hotel-hero.mp4"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-md"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-noir/90" />

        <div className="mask-caption eyebrow absolute top-[30%] left-1/2 -translate-x-1/2">
          Welcome to
        </div>

        <div
          ref={wrapRef}
          className="relative aspect-4/1 w-[92vw] max-w-350"
        >
          <video
            src="/assets/video/hotel-hero.mp4"
            poster={heroPoster.src}
            className="h-full w-full object-cover"
            style={{
              WebkitMaskImage: `url("${MASK_SVG}")`,
              maskImage: `url("${MASK_SVG}")`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>

        <p className="mask-caption absolute bottom-[28%] left-1/2 -translate-x-1/2 font-serif text-lg text-cream/80 sm:text-xl">
          {hotel.tagline}
        </p>

        {/* Scroll cue */}
        <a
          href="#about"
          aria-label="Scroll to explore"
          className="mask-caption absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/70 transition-colors hover:text-gold"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
