"use client";

import { useEffect, useRef, useState } from "react";
import { hotel, heroPoster } from "../lib/content";
import { ArrowRight, StarIcon } from "./icons";

/* Background playlist: the trimmed brand-free loop first, then the full
   tour video once it ends, cycling back around. */
const heroVideos = [
  "/assets/video/hotel-hero.mp4",
  "/assets/video/hotel-tour.mp4",
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState(0);

  // When the playlist advances, the src swap resets the element to a paused
  // state in some browsers — kick playback explicitly (muted, so allowed).
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [videoIndex]);

  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      {/* Background tour video */}
      <video
        ref={videoRef}
        key={heroVideos[videoIndex]}
        src={heroVideos[videoIndex]}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={videoIndex === 0 ? heroPoster.src : undefined}
        onEnded={() => setVideoIndex((i) => (i + 1) % heroVideos.length)}
      />

      {/* Cinematic overlays — layered so left-aligned text stays legible
          over any (including bright) video frame. */}
      <div className="absolute inset-0 bg-noir/45" />
      <div className="absolute inset-0 bg-linear-to-r from-noir via-noir/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-noir/80 via-transparent to-noir/40" />

      {/* Content — centred so it sits behind the FULLMAN window and reads
          through the knocked-out letters as the frame closes in.
          `hero-copy` is the fade target MaskScroll animates on scroll. */}
      <div className="hero-copy text-halo relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col items-center justify-center px-5 pt-24 pb-28 text-center sm:px-8">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          Welcome to {hotel.name}
        </p>

        <h1 className="max-w-4xl font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl">
          Timeless luxury,
          <br />
          <span className="text-gold-soft">effortless comfort.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
          An address for travellers who expect more — refined rooms, world-class
          amenities and hospitality that anticipates your every need.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <a
            href="#booking"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-medium text-noir transition-colors hover:bg-gold-soft"
          >
            Book your stay
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#rooms"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 px-7 py-4 text-sm font-medium text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
          >
            Explore rooms
          </a>
        </div>

        {/* Rating chip */}
        <div className="mt-12 flex items-center justify-center gap-3 text-cream/80">
          <span className="flex text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-4 w-4" />
            ))}
          </span>
          <span className="text-sm">
            <strong className="font-semibold text-cream">{hotel.rating}</strong>{" "}
            / 5 · {hotel.reviewCount.toLocaleString()} guest reviews
          </span>
        </div>
      </div>
    </section>
  );
}
