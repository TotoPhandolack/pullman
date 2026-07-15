/* ------------------------------------------------------------------ *
 * Pullman Hotel — site content
 * All copy + asset references live here so components stay presentational.
 * Photos & tour video were sourced into /public/assets from the
 * reference listing and renamed hotel-01..30 / hotel-tour.mp4.
 * ------------------------------------------------------------------ */

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Room = {
  name: string;
  blurb: string;
  price: number;
  size: string;
  guests: string;
  image: GalleryImage;
  features: string[];
};

export type Amenity = {
  icon: string; // key into the icon map in <Amenities/>
  label: string;
  description: string;
};

export type Review = {
  quote: string;
  author: string;
  origin: string;
  rating: number;
};

export const hotel = {
  name: "Pullman Hotel",
  wordmark: "PULLMAN",
  tagline: "Timeless Luxury, Effortless Comfort",
  intro:
    "A sanctuary of quiet elegance where every detail is considered. Pullman Hotel pairs contemporary design with warm, intuitive service — an address for travellers who expect more from a stay.",
  address: "88 Grand Boulevard, Riverside District",
  city: "Metropolis",
  phone: "+1 (555) 018-2200",
  email: "reservations@pullmanhotel.com",
  reception: "24-hour reception & concierge",
  rating: 4.8,
  reviewCount: 1240,
} as const;

/** Intrinsic size helper: hotel-01..19 are 1280×853, hotel-20..30 are 960×660. */
function dims(n: number): { width: number; height: number } {
  return n <= 19 ? { width: 1280, height: 853 } : { width: 960, height: 660 };
}

function img(n: number, alt: string): GalleryImage {
  const id = String(n).padStart(2, "0");
  return { src: `/assets/images/hotel-${id}.jpg`, alt, ...dims(n) };
}

export const heroPoster = img(28, "Aerial view of Pullman Hotel at dusk");

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Rooms", href: "#rooms" },
  { label: "Gallery", href: "#gallery" },
  { label: "Amenities", href: "#amenities" },
  { label: "Contact", href: "#contact" },
] as const;

export const stats = [
  { value: "120", label: "Rooms & Suites" },
  { value: "4.8", label: "Guest Rating" },
  { value: "24/7", label: "Concierge" },
  { value: "1998", label: "Established" },
] as const;

export const aboutImages: GalleryImage[] = [
  img(7, "Bright, elegantly furnished guest room"),
  img(17, "Suite living area with lounge seating"),
];

export const rooms: Room[] = [
  {
    name: "Deluxe Room",
    blurb:
      "A refined retreat with plush bedding, curated furnishings and city or garden views.",
    price: 189,
    size: "38 m²",
    guests: "2 guests",
    image: img(25, "Deluxe Room interior with elegant furnishings"),
    features: ["King or twin", "Garden view", "Rain shower", "Smart TV"],
  },
  {
    name: "Executive Suite",
    blurb:
      "A spacious suite with a separate lounge, premium amenities and floor-to-ceiling windows.",
    price: 289,
    size: "56 m²",
    guests: "2–3 guests",
    image: img(12, "Executive Suite with separate living area"),
    features: ["Living room", "Lounge access", "Bathtub", "Nespresso"],
  },
  {
    name: "Panorama Suite",
    blurb:
      "Our signature suite, framing sweeping skyline views from a private corner vantage.",
    price: 389,
    size: "72 m²",
    guests: "2–4 guests",
    image: img(27, "Panorama Suite with floor-to-ceiling views"),
    features: ["Panoramic view", "Walk-in closet", "Soaking tub", "Butler"],
  },
];

export const amenities: Amenity[] = [
  {
    icon: "pool",
    label: "Infinity Pool",
    description: "Heated rooftop pool with skyline views, open sunrise to late.",
  },
  {
    icon: "spa",
    label: "Spa & Wellness",
    description: "Full-service spa, sauna and treatment rooms for deep restoration.",
  },
  {
    icon: "dining",
    label: "Fine Dining",
    description: "Seasonal menus by our resident chef, plus an intimate wine bar.",
  },
  {
    icon: "gym",
    label: "Fitness Centre",
    description: "24-hour gym with premium equipment and personal training.",
  },
  {
    icon: "concierge",
    label: "Concierge",
    description: "Round-the-clock concierge to curate every part of your stay.",
  },
  {
    icon: "wifi",
    label: "High-Speed Wi-Fi",
    description: "Complimentary fibre internet throughout the property.",
  },
  {
    icon: "parking",
    label: "Valet Parking",
    description: "Secure on-site valet parking with electric charging.",
  },
  {
    icon: "bar",
    label: "Rooftop Bar",
    description: "Signature cocktails and small plates above the city lights.",
  },
];

export const reviews: Review[] = [
  {
    quote:
      "Impeccable from arrival to checkout. The suite was stunning and the staff anticipated our every need.",
    author: "Amelia R.",
    origin: "London, UK",
    rating: 5,
  },
  {
    quote:
      "The rooftop pool at sunset is worth the stay alone. Quiet, elegant and beautifully maintained.",
    author: "David C.",
    origin: "Singapore",
    rating: 5,
  },
  {
    quote:
      "A rare blend of modern design and genuine warmth. Already booked our return visit.",
    author: "Sofia M.",
    origin: "Madrid, ES",
    rating: 5,
  },
];

/** Full gallery — every photo we pulled from the reference listing. */
export const gallery: GalleryImage[] = Array.from({ length: 30 }, (_, i) =>
  img(i + 1, `Pullman Hotel gallery photo ${i + 1}`),
);
