import Image from "next/image";
import { hotel, stats, aboutImages } from "../lib/content";

export default function About() {
  const [primary, secondary] = aboutImages;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div className="reveal">
            <p className="eyebrow mb-4">Our Story</p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-[2.75rem]">
              A sanctuary of quiet elegance in the heart of the city
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {hotel.intro}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              From the moment you arrive, every detail is considered — the
              texture of the linens, the warmth of the lighting, the calm of a
              perfectly kept room. This is hospitality as it was meant to be.
            </p>

            <div className="mt-8 h-px w-24 bg-gold/60" />
            <p className="mt-6 font-serif text-lg italic text-cream/90">
              “Where every stay becomes a memory.”
            </p>
          </div>

          {/* Images */}
          <div className="reveal relative">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={primary.src}
                alt={primary.alt}
                width={primary.width}
                height={primary.height}
                className="h-[26rem] w-full object-cover sm:h-[34rem]"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            <div className="absolute -bottom-10 -left-6 hidden w-48 overflow-hidden rounded-xl border-4 border-noir shadow-2xl sm:block lg:w-56">
              <Image
                src={secondary.src}
                alt={secondary.alt}
                width={secondary.width}
                height={secondary.height}
                className="h-40 w-full object-cover lg:h-48"
                sizes="14rem"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="reveal mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-noir px-6 py-8 text-center sm:py-10"
            >
              <div className="font-serif text-3xl font-medium text-gold sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
