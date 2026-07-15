import { hotel, navLinks } from "../lib/content";
import { InstagramIcon, FacebookIcon, XIcon } from "./icons";

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: XIcon, label: "X", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-noir">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-semibold tracking-[0.35em] text-cream">
              {hotel.wordmark}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {hotel.tagline}. A sanctuary of quiet elegance in the heart of{" "}
              {hotel.city}.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>{hotel.address}</li>
              <li>{hotel.city}</li>
              <li>
                <a
                  href={`tel:${hotel.phone.replace(/[^+\d]/g, "")}`}
                  className="transition-colors hover:text-cream"
                >
                  {hotel.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${hotel.email}`}
                  className="transition-colors hover:text-cream"
                >
                  {hotel.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {hotel.name}. All rights reserved.
          </p>
          <p className="flex gap-6">
            <a href="#" className="transition-colors hover:text-cream">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-cream">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
