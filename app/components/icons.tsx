import type { SVGProps } from "react";

/* Lucide-style line icons, 24×24, inherit currentColor. */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);

export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Base>
);

export const MoonIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
  </Base>
);

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const ChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);

export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Base>
);

export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base fill="currentColor" stroke="none" {...p}>
    <path d="M12 2l2.9 6.26L21.6 9.3l-4.8 4.68 1.14 6.62L12 17.77 6.06 20.6l1.14-6.62L2.4 9.3l6.7-1.04L12 2z" />
  </Base>
);

export const QuoteMark = (p: IconProps) => (
  <Base fill="currentColor" stroke="none" {...p}>
    <path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c0 2-1.5 3-3 3.5.5.5 1 1 1.5 1.5C9 18.5 11 15.5 11 11.5 11 8 9.5 6 7.5 6zm9 0C14 6 12 8 12 10.5S14 15 16.5 15c0 2-1.5 3-3 3.5.5.5 1 1 1.5 1.5C18 18.5 20 15.5 20 11.5 20 8 18.5 6 16.5 6z" />
  </Base>
);

export const PhoneIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </Base>
);

export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Base>
);

export const MapPinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
    <circle cx="12" cy="10" r="3" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const UsersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M16 20v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1" />
    <circle cx="9" cy="7" r="3" />
    <path d="M22 20v-1a4 4 0 00-3-3.9M16 4.1a4 4 0 010 7.8" />
  </Base>
);

export const ExpandIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
  </Base>
);

/* ---- Amenity icons, keyed to content.ts ---- */

export const amenityIcons = {
  pool: (p: IconProps) => (
    <Base {...p}>
      <path d="M2 20c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M6 16V6a2 2 0 012-2c1.5 0 2 1 2 2M14 12V6a2 2 0 012-2c1.5 0 2 1 2 2" />
      <path d="M6 10h4M14 10h4" />
    </Base>
  ),
  spa: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 21c0-5 3-8 8-9-1 5-4 8-8 9z" />
      <path d="M12 21c0-5-3-8-8-9 1 5 4 8 8 9z" />
      <path d="M12 21c0-3 0-6 2-9" />
    </Base>
  ),
  dining: (p: IconProps) => (
    <Base {...p}>
      <path d="M6 3v7a2 2 0 004 0V3M8 3v18M18 3c-1.5 1-2 3-2 6s.5 4 2 4v8" />
    </Base>
  ),
  gym: (p: IconProps) => (
    <Base {...p}>
      <path d="M6.5 6.5l11 11M4 9l-1 1 1 1M20 15l1-1-1-1" />
      <rect x="3" y="7" width="4" height="10" rx="1" transform="rotate(45 5 12)" />
      <rect x="17" y="7" width="4" height="10" rx="1" transform="rotate(45 19 12)" />
    </Base>
  ),
  concierge: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 19h16" />
      <path d="M5 19a7 7 0 0114 0" />
      <path d="M12 8V5M9 5h6" />
    </Base>
  ),
  wifi: (p: IconProps) => (
    <Base {...p}>
      <path d="M2 8.5a16 16 0 0120 0M5 12a11 11 0 0114 0M8.5 15.5a6 6 0 017 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </Base>
  ),
  parking: (p: IconProps) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </Base>
  ),
  bar: (p: IconProps) => (
    <Base {...p}>
      <path d="M5 4h14l-7 8-7-8zM12 12v6M8 20h8" />
    </Base>
  ),
} as const;

/* ---- Social ---- */

export const InstagramIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </Base>
);

export const FacebookIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 9V7c0-1 .5-2 2-2h2V2h-3c-2.5 0-4 1.7-4 4v3H8v3h3v10h3V12h3l1-3h-4z" />
  </Base>
);

export const XIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4l16 16M20 4L4 20" />
  </Base>
);
