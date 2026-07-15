import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pullman Hotel — Timeless Luxury & Refined Stays",
  description:
    "Pullman Hotel offers refined rooms and suites, world-class amenities, and unforgettable hospitality. Discover an elegant escape and book your stay.",
  keywords: [
    "Pullman Hotel",
    "luxury hotel",
    "boutique hotel",
    "hotel booking",
    "suites",
    "resort",
  ],
  openGraph: {
    title: "Pullman Hotel — Timeless Luxury & Refined Stays",
    description:
      "Refined rooms and suites, world-class amenities, and unforgettable hospitality.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-noir text-cream">{children}</body>
    </html>
  );
}
