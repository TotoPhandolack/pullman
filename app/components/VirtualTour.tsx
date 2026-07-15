"use client";

import { useState } from "react";
import { tourStops } from "../lib/tour-stops";
import { virtualTour } from "../lib/content";
import TourViewer from "./TourViewer";
import TourStopThumb from "./TourStopThumb";

export default function VirtualTour() {
  const [activeId, setActiveId] = useState(tourStops[0].id);
  const active = tourStops.find((s) => s.id === activeId) ?? tourStops[0];
  const activeIndex = tourStops.findIndex((s) => s.id === active.id) + 1;

  return (
    <section id="virtual-tour" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{virtualTour.eyebrow}</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
            {virtualTour.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {virtualTour.subtitle}
          </p>
        </div>

        <div className="reveal mt-14">
          <TourViewer
            src={active.image}
            alt={active.title}
            hotspots={active.hotspots}
            defaultYaw={active.defaultYaw}
            defaultPitch={active.defaultPitch}
            onNavigate={setActiveId}
            className="h-72 w-full sm:h-[30rem]"
          />

          <div className="mt-5 flex items-center justify-between gap-4">
            <h3 className="font-serif text-2xl text-cream">{active.title}</h3>
            <span className="shrink-0 text-sm text-muted">
              {virtualTour.stopLabel} {activeIndex} / {tourStops.length}
            </span>
          </div>

          <div className="mt-8 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
            {tourStops.map((stop) => (
              <button
                key={stop.id}
                onClick={() => setActiveId(stop.id)}
                className="w-40 shrink-0 snap-start text-left sm:w-48"
                aria-pressed={stop.id === activeId}
              >
                <TourStopThumb
                  stop={stop}
                  showLabel
                  sizes="200px"
                  className={`h-24 w-full transition sm:h-28 ${
                    stop.id === activeId
                      ? "ring-2 ring-gold"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
