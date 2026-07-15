import { amenities } from "../lib/content";
import { amenityIcons } from "./icons";

export default function Amenities() {
  return (
    <section id="amenities" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Amenities</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Thoughtful facilities and services designed around your comfort,
            available whenever you need them.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((amenity, i) => {
            const Icon = amenityIcons[amenity.icon as keyof typeof amenityIcons];
            return (
              <div
                key={amenity.label}
                className="reveal group rounded-2xl border border-line bg-noir p-7 transition-colors hover:border-gold/50"
                style={{ ["--reveal-delay" as string]: `${(i % 4) * 80}ms` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-noir">
                  {Icon ? <Icon className="h-6 w-6" /> : null}
                </span>
                <h3 className="mt-5 font-serif text-xl font-medium text-cream">
                  {amenity.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {amenity.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
