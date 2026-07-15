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
  title: "Fullman Hotel — Timeless Luxury & Refined Stays",
  description:
    "Fullman Hotel offers refined rooms and suites, world-class amenities, and unforgettable hospitality. Discover an elegant escape and book your stay.",
  keywords: [
    "Fullman Hotel",
    "luxury hotel",
    "boutique hotel",
    "hotel booking",
    "suites",
    "resort",
  ],
  openGraph: {
    title: "Fullman Hotel — Timeless Luxury & Refined Stays",
    description:
      "Refined rooms and suites, world-class amenities, and unforgettable hospitality.",
    type: "website",
  },
};

/* Light is the default theme; a stored "dark" choice must apply before
 * first paint, so this runs as a blocking inline script — not in React. */
const themeInit = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-noir text-cream">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}
