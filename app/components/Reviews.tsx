import { reviews, hotel } from "../lib/content";
import { StarIcon, QuoteMark } from "./icons";

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="reveal grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Guest Reviews</p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
              Loved by travellers the world over
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-serif text-5xl font-medium text-gold">
                {hotel.rating}
              </span>
              <div>
                <span className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                <p className="mt-1 text-sm text-muted">
                  Based on {hotel.reviewCount.toLocaleString()} verified stays
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review, i) => (
              <figure
                key={review.author}
                className={`reveal relative rounded-2xl border border-line bg-surface p-7 ${
                  i === 0 ? "sm:col-span-2" : ""
                }`}
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <QuoteMark className="h-8 w-8 text-gold/40" />
                <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-cream/90">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-cream">
                      {review.author}
                    </div>
                    <div className="text-xs text-muted">{review.origin}</div>
                  </div>
                  <span className="flex text-gold">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <StarIcon key={s} className="h-3.5 w-3.5" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
