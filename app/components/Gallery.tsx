"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { gallery } from "../lib/content";
import { CloseIcon, ChevronLeft, ChevronRight, ExpandIcon } from "./icons";

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % gallery.length)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  const current = index !== null ? gallery[index] : null;

  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Gallery</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
            A glimpse of the experience
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Explore our rooms, dining, and spaces through the lens of guests and
            photographers.
          </p>
        </div>

        {/* Masonry */}
        <div className="reveal mt-14 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {gallery.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open ${photo.alt}`}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-noir/0 opacity-0 transition-all duration-300 group-hover:bg-noir/40 group-hover:opacity-100">
                <ExpandIcon className="h-7 w-7 text-cream" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && current && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-noir/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <CloseIcon className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure
            className="max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
              sizes="90vw"
              priority
            />
            <figcaption className="mt-3 text-center text-sm text-muted">
              {index! + 1} / {gallery.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
