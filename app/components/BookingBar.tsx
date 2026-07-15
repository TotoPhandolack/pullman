"use client";

import { useState } from "react";
import { rooms } from "../lib/content";
import { ArrowRight } from "./icons";

export default function BookingBar() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Demo only — no backend. Show a friendly confirmation.
    e.preventDefault();
    setSubmitted(true);
  };

  const fieldClass =
    "w-full rounded-lg border border-line bg-noir px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold [color-scheme:dark]";

  return (
    <section id="booking" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.4fr]">
            {/* Left copy */}
            <div className="border-b border-line p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="eyebrow mb-4">Reservations</p>
              <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl">
                Reserve your stay
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Check availability and secure the best rate. Our concierge is on
                hand to tailor every detail of your visit.
              </p>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold">
                Best rate guaranteed
              </p>
            </div>

            {/* Booking form */}
            <div className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                    Check in
                  </span>
                  <input type="date" required className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                    Check out
                  </span>
                  <input type="date" required className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                    Guests
                  </span>
                  <select className={fieldClass} defaultValue="2">
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4+ guests</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                    Room type
                  </span>
                  <select className={fieldClass} defaultValue={rooms[0].name}>
                    {rooms.map((room) => (
                      <option key={room.name} value={room.name}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-medium text-noir transition-colors hover:bg-gold-soft sm:col-span-2"
                >
                  Check availability
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              {submitted && (
                <p
                  role="status"
                  className="mt-4 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
                >
                  Thank you — this is a demo booking form. In a live site, our
                  team would confirm availability and pricing for your dates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
