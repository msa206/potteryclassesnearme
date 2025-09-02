import type { Metadata, Viewport } from "next";
import Link from 'next/link';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Find Pottery Classes Near You | Nationwide Directory",
    template: "%s | Pottery Classes Directory"
  },
  description: "Discover pottery classes, ceramic workshops, and clay studios across the United States. Find wheel throwing, hand-building, and glazing classes near you.",
  keywords: "pottery classes, ceramic workshops, clay studios, wheel throwing, hand-building, glazing, pottery near me",
  authors: [{ name: "Pottery Classes Directory" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://potteryclasses.com",
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
    <html lang="en">
      <body className="antialiased">
        <header className="bg-white border-b border-sand">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-clay">
                Pottery Classes
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
                  Find pottery classes, ceramic workshops, and clay studios near you. 
                  Our comprehensive directory helps you discover the perfect place to learn pottery.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/pottery-classes" className="text-white/80 hover:text-white">
                      All Pottery Classes
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="text-white/80 hover:text-white">
                      Search by Location
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Popular Cities</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/pottery-classes/fl/miami" className="text-white/80 hover:text-white">
                      Miami
                    </Link>
                  </li>
                  <li>
                    <Link href="/pottery-classes/ny/new-york-ny" className="text-white/80 hover:text-white">
                      New York
                    </Link>
                  </li>
                  <li>
                    <Link href="/pottery-classes/ca/los-angeles-ca" className="text-white/80 hover:text-white">
                      Los Angeles
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
