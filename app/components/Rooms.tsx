import Image from "next/image";
import { rooms } from "../lib/content";
import { ArrowRight, UsersIcon, ExpandIcon } from "./icons";

export default function Rooms() {
  return (
    <section id="rooms" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Accommodation</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
            Rooms &amp; suites for every journey
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Each space is designed as a private retreat — thoughtfully furnished,
            beautifully lit, and finished with the details that matter.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <article
              key={room.name}
              className="reveal group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-gold/50"
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={room.image.src}
                  alt={room.image.alt}
                  width={room.image.width}
                  height={room.image.height}
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                />
                <div className="absolute right-4 top-4 rounded-full bg-noir/85 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <span className="font-serif text-lg font-medium text-gold">
                    ${room.price}
                  </span>
                  <span className="text-muted"> / night</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-2xl font-medium text-cream">
                  {room.name}
                </h3>

                <div className="mt-3 flex items-center gap-5 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <ExpandIcon className="h-4 w-4 text-gold" />
                    {room.size}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UsersIcon className="h-4 w-4 text-gold" />
                    {room.guests}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {room.blurb}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-full border border-line px-3 py-1 text-xs text-cream/80"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#booking"
                  className="group/btn mt-6 inline-flex items-center gap-2 self-start border-b border-gold/50 pb-1 text-sm font-medium text-gold transition-colors hover:border-gold"
                >
                  Reserve this room
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
