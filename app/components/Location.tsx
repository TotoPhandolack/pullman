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

          {/* Live map panel */}
          <div className="reveal relative min-h-[22rem] overflow-hidden rounded-3xl border border-line bg-noir">
            <iframe
              title={`Map showing the location of ${hotel.name}`}
              src={`https://www.google.com/maps?q=${hotel.geo.lat},${hotel.geo.lng}&z=15&output=embed`}
              className="absolute inset-0 h-full w-full grayscale-[15%] contrast-[1.05]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={hotel.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-noir/90 px-4 py-2 text-sm font-medium text-cream backdrop-blur-sm transition-colors hover:text-gold"
            >
              <MapPinIcon className="h-4 w-4" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
