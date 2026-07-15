import { hotel } from "../lib/content";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "./icons";

const contactItems = [
  {
    icon: MapPinIcon,
    label: "Address",
    value: `${hotel.address}, ${hotel.city}`,
  },
  { icon: PhoneIcon, label: "Phone", value: hotel.phone, href: `tel:${hotel.phone.replace(/[^+\d]/g, "")}` },
  { icon: MailIcon, label: "Email", value: hotel.email, href: `mailto:${hotel.email}` },
  { icon: ClockIcon, label: "Reception", value: hotel.reception },
];

export default function Location() {
  return (
    <section id="contact" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          {/* Contact details */}
          <div className="reveal flex flex-col justify-center">
            <p className="eyebrow mb-4">Find Us</p>
            <h2 className="font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl lg:text-5xl">
              Perfectly placed, warmly welcomed
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Moments from the river and the city&apos;s finest dining, Pullman
              Hotel is your calm base in the heart of it all.
            </p>

            <ul className="mt-10 space-y-6">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-base text-cream transition-colors hover:text-gold"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-base text-cream">{item.value}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Decorative map panel (self-contained, no external embed) */}
          <div className="reveal relative min-h-[22rem] overflow-hidden rounded-3xl border border-line bg-noir">
            {/* grid streets */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* diagonal avenue */}
            <div className="absolute -inset-10 rotate-[24deg]">
              <div className="absolute left-1/3 top-0 h-full w-8 bg-surface-2" />
              <div className="absolute left-2/3 top-0 h-3 w-full bg-surface-2" />
            </div>
            {/* radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--color-gold)_18%,transparent),transparent_60%)]" />

            {/* pin */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-noir shadow-lg shadow-black/40">
                <MapPinIcon className="h-7 w-7" />
              </span>
              <span className="mt-3 rounded-full border border-line bg-noir/90 px-4 py-1.5 text-sm font-medium text-cream backdrop-blur-sm">
                {hotel.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
