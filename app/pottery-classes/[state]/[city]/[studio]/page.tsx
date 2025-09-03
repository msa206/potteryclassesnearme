import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getCity, getProviderBySlugs } from "@/lib/queries";
import { getStateNameFromSlug, getStateAbbreviation } from "@/lib/slugify";
import { formatWorkingHours } from "@/lib/formatHours";

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ state: string; city: string; studio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, studio: studioSlug } = await params;
  const studio = await getProviderBySlugs(state, city, studioSlug);
  if (!studio) return { title: "Studio not found" };

  const stateName = getStateNameFromSlug(state);
  const stateAbbrev = getStateAbbreviation(stateName);
  const title = `Pottery Classes at ${studio.name}`;
  
  // Random description formats
  const descriptions = [
    `${studio.name} offers pottery classes in ${studio.city}, ${stateAbbrev}. Learn beginner pottery now.`,
    `${studio.name} offers pottery classes in ${studio.city}, ${stateAbbrev}. Beginner pottery classes available.`,
    `${studio.name} offers pottery classes in ${studio.city}, ${stateAbbrev}. Learn pottery and have fun.`
  ];
  
  // Use studio name hash to consistently pick same description for same studio
  const hash = studio.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const description = descriptions[hash % descriptions.length];
  
  const canonical = `https://localpotteryclasses.com/pottery-classes/${state}/${city}/${studioSlug}`;
  
  return { 
    title, 
    description, 
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

export default async function StudioPage({ params }: Props) {
  const { state, city: citySlug, studio: studioSlug } = await params;
  const studio = await getProviderBySlugs(state, citySlug, studioSlug);
  const city = await getCity(state, citySlug);
  
  if (!studio || !city) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-3xl font-bold text-ink text-center mb-4">Studio Not Found</h1>
          <p className="text-center text-ink/60">
            We couldn't find this studio in our directory. 
            <Link href="/search" className="text-teal hover:text-clay ml-2">
              Try searching instead
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": studio.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": studio.street,
      "addressLocality": studio.city,
      "addressRegion": getStateNameFromSlug(city.state_slug),
      "postalCode": studio.zip,
      "addressCountry": "US"
    },
    "telephone": studio.phone,
    "url": studio.website,
    ...(studio.lat && studio.lng ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": studio.lat,
        "longitude": studio.lng
      }
    } : {}),
    ...(studio.rating != null && studio.review_count != null ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": studio.rating,
        "reviewCount": studio.review_count
      }
    } : {})
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <Script
        id="studio-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/" className="text-teal hover:text-clay">
            Home
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <Link href={`/pottery-classes/${city.state_slug}`} className="text-teal hover:text-clay">
            {getStateNameFromSlug(city.state_slug)}
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <Link href={`/pottery-classes/${city.state_slug}/${city.city_slug}`} className="text-teal hover:text-clay">
            {city.city}
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">{studio.name}</span>
        </nav>

        {/* Studio Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {studio.name}
          </h1>
          
          {studio.rating != null && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.floor(studio.rating) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-ink">
                {Number(studio.rating).toFixed(1)}
              </span>
              <span className="text-ink/60">
                ({studio.review_count || 0} review{studio.review_count !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3 text-ink/80 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-teal mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium">{studio.street}</p>
                <p>{studio.city}, {getStateNameFromSlug(city.state_slug)} {studio.zip}</p>
              </div>
            </div>

            {studio.phone && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${studio.phone}`} className="hover:text-teal transition-colors">
                  {studio.phone}
                </a>
              </div>
            )}

            {studio.website && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a 
                  href={studio.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal hover:text-clay transition-colors"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Business Hours */}
          {studio.working_hours && (() => {
              const { formatted, today, isOpenNow } = formatWorkingHours(studio.working_hours);
              return formatted.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-ink">Business Hours</h3>
                    {today && today.includes('Closed') ? (
                      <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">Closed Today</span>
                    ) : isOpenNow ? (
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Open Now</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    {formatted.map((line, idx) => {
                      const [day, time] = line.split(': ');
                      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const today = new Date();
                      const todayName = dayNames[today.getDay()];
                      const isToday = day === todayName;
                      const isClosed = time === 'Closed';
                      
                      return (
                        <div 
                          key={idx} 
                          className={`inline-flex items-center rounded-full overflow-hidden border ${
                            isToday ? 'border-teal shadow-sm ring-2 ring-teal/20' : 'border-sand/50'
                          }`}
                        >
                          <div className={`px-4 py-2.5 ${
                            isClosed ? 'bg-gray-50' : 'bg-porcelain'
                          } w-[110px]`}>
                            <span className={`text-xs font-medium uppercase tracking-wide ${
                              isToday ? 'text-teal' : isClosed ? 'text-gray-400' : 'text-ink/60'
                            }`}>
                              {day}
                            </span>
                          </div>
                          <div className={`px-4 py-2.5 w-[130px] text-center ${
                            isClosed ? 'bg-gray-100' : ''
                          }`} style={{ backgroundColor: isClosed ? '' : '#5f7c74' }}>
                            <span className={`text-xs font-medium ${
                              isClosed ? 'text-gray-500' : 'text-white'
                            }`}>
                              {time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            })()}

          {/* Call to Action */}
          <div className="mt-8 pt-8 border-t border-sand/20">
            <h2 className="text-lg font-semibold text-ink mb-3">
              Ready to Start Your Pottery Journey?
            </h2>
            <p className="text-ink/60 mb-4">
              Contact {studio.name} directly to inquire about class schedules, pricing, and availability.
            </p>
            <div className="flex flex-wrap gap-4">
              {studio.phone && (
                <a
                  href={`tel:${studio.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-lg hover:bg-clay transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              )}
              {studio.website && (
                <a
                  href={studio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal border-2 border-teal rounded-lg hover:bg-teal hover:text-white transition-colors font-medium"
                >
                  Visit Website
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">
            About {studio.name}
          </h2>
          <p className="text-ink/70 leading-relaxed">
            {studio.name} is a pottery studio located in {studio.city}, {getStateNameFromSlug(city.state_slug)}. 
            They offer a variety of ceramic classes and workshops for all skill levels, 
            from beginner wheel throwing to advanced glazing techniques. Whether you're 
            looking to explore a new hobby or refine your pottery skills, {studio.name} 
            provides a welcoming environment for creative expression through clay.
          </p>
        </div>


        {/* Related Studios */}
        <div className="mt-12 pt-8 border-t border-sand/20">
          <h2 className="text-2xl font-semibold text-ink mb-4">
            More Pottery Classes in {city.city}
          </h2>
          <p className="text-ink/60 mb-6">
            Explore other pottery studios and ceramic workshops in the {city.city} area.
          </p>
          <Link
            href={`/pottery-classes/${city.state_slug}/${city.city_slug}`}
            className="inline-flex items-center gap-2 text-teal hover:text-clay font-medium"
          >
            View all studios in {city.city}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}