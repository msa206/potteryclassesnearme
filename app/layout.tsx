import type { Metadata, Viewport } from "next";
import Link from 'next/link';
import { Montserrat, Source_Sans_3 } from 'next/font/google';
import "./globals.css";

// Configure fonts
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Find Pottery Classes Near You | LocalPotteryClasses.com",
  description: "Discover pottery classes, ceramic workshops, and clay studios across the United States. Find wheel throwing, hand-building, and glazing classes near you.",
  keywords: "pottery classes, ceramic workshops, clay studios, wheel throwing, hand-building, glazing, pottery near me",
  authors: [{ name: "Pottery Classes Directory" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://localpotteryclasses.com",
    siteName: "Pottery Classes Directory",
    title: "Find Pottery Classes Near You",
    description: "Discover pottery classes, ceramic workshops, and clay studios across the United States.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Pottery Classes Near You",
    description: "Discover pottery classes, ceramic workshops, and clay studios across the United States.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#D08C72",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${sourceSans3.variable}`}>
      <body className="antialiased font-sans">
        <header className="bg-white border-b border-sand">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-clay font-serif">
                Local Pottery Classes
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="text-teal hover:text-clay transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-teal hover:text-clay transition-colors">
                  Search Pottery Classes
                </Link>
              </div>
            </div>
          </nav>
        </header>
        
        {children}
        
        <footer className="bg-ink text-white py-12 mt-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-sm text-white/80">
                  Directory of pottery classes across all 50 states. Curated studios, wheel-throwing & hand-building workshops, updated regularly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/search" className="text-white/80 hover:text-white">
                      Search by Location
                    </Link>
                  </li>
                  <li>
                    <Link href="/pottery-classes" className="text-white/80 hover:text-white">
                      Browse by State
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-cities" className="text-white/80 hover:text-white">
                      Browse by City
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Popular Cities</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/pottery-classes/florida/miami" className="text-white/80 hover:text-white">
                      Pottery Classes in Miami
                    </Link>
                  </li>
                  <li>
                    <Link href="/pottery-classes/new-york/new-york" className="text-white/80 hover:text-white">
                      Pottery Classes in New York
                    </Link>
                  </li>
                  <li>
                    <Link href="/pottery-classes/california/los-angeles" className="text-white/80 hover:text-white">
                      Pottery Classes in Los Angeles
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/60">
              © {new Date().getFullYear()} Pottery Classes Directory. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
