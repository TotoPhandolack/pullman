import Image from "next/image";
import type { TourStop } from "../lib/tour-stops";

export default function TourStopThumb({
  stop,
  className = "",
  showLabel = true,
  sizes = "400px",
}: {
  stop: TourStop;
  className?: string;
  showLabel?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-surface ${className}`}
    >
      <Image
        src={stop.image}
        alt={stop.title}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/0 to-noir/10" />
      <div className="absolute left-3 top-3 rounded-full bg-noir/60 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gold">
        360&deg; VIEW
      </div>
      {showLabel && (
        <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-lg text-cream sm:text-xl">
          {stop.title}
        </span>
      )}
    </div>
  );
}
