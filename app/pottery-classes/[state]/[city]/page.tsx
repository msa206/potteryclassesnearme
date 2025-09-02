import { Metadata } from "next";
import Link from "next/link";
import { getCity, listProvidersForCity } from "@/lib/queries";
import { slugify } from "@/lib/slugify";
import { formatHoursCompact } from "@/lib/formatHours";

export const revalidate = 60 * 60; // ISR: 1 hour

type Props = { params: Promise<{ state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city: citySlug } = await params;
  const city = await getCity(state, citySlug);
  if (!city) return { title: "City not found" };
  
  const title = `Pottery Classes in ${city.city}, ${city.state}`;
  const description = `Browse pottery studios and classes in ${city.city}, ${city.state}. Find wheel throwing, hand-building, and glazing classes near you.`;
  const canonical = `https://potteryclasses.com/pottery-classes/${state}/${citySlug}/`;
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

export default async function CityPage({ params }: Props) {
  const { state, city: citySlug } = await params;
  const city = await getCity(state, citySlug);
  if (!city) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-3xl font-bold text-ink text-center mb-4">City Not Found</h1>
          <p className="text-center text-ink/60">
            We couldn't find this city in our directory. 
            <Link href="/search" className="text-teal hover:text-clay ml-2">
              Try searching instead
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const providers = await listProvidersForCity(city.city_slug, city.state_slug, 200);

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/pottery-classes" className="text-teal hover:text-clay">
            All Cities
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <Link href={`/pottery-classes/state/${city.state_slug}`} className="text-teal hover:text-clay">
            {city.state}
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">{city.city}</span>
        </nav>

        <h1 className="text-4xl font-bold text-ink mb-6">
          Pottery Classes in {city.city}, {city.state}
        </h1>
        
        <p className="text-lg text-ink/70 mb-8 max-w-3xl">
          Discover {providers.length} pottery studio{providers.length !== 1 ? 's' : ''} and ceramic workshop{providers.length !== 1 ? 's' : ''} 
          in {city.city}. From beginner wheel throwing to advanced glazing techniques, 
          find the perfect pottery class for your skill level.
        </p>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-ink/60">No pottery studios found in this city yet.</p>
            <Link href="/search" className="inline-block mt-4 text-teal hover:text-clay">
              Search other cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                <Link
                  href={`/pottery-classes/${city.state_slug}/${city.city_slug}/${slugify(provider.name)}`}
                  className="block group"
                >
                  <h2 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors mb-2">
                    {provider.name}
                  </h2>
                </Link>
                
                <div className="text-ink/60 space-y-1">
                  <p className="text-sm">
                    {provider.street}, {provider.city} {provider.state} {provider.postal_code}
                  </p>
                  
                  {provider.phone_number && (
                    <p className="text-sm">
                      <a href={`tel:${provider.phone_number}`} className="hover:text-teal">
                        {provider.phone_number}
                      </a>
                    </p>
                  )}
                  
                  {provider.working_hours && (
                    <p className="text-sm">
                      {formatHoursCompact(provider.working_hours)}
                    </p>
                  )}
                  
                  {provider.review_stars != null && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-ink">
                        {Number(provider.review_stars).toFixed(1)}
                      </span>
                      <span className="text-sm text-ink/50">
                        ({provider.review_count || 0} review{provider.review_count !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/pottery-classes/${city.state_slug}/${city.city_slug}/${slugify(provider.name)}`}
                  className="inline-flex items-center gap-1 mt-4 text-teal hover:text-clay transition-colors text-sm font-medium"
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Related Cities */}
        <section className="mt-16 pt-12 border-t border-sand/20">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Explore Nearby Cities
          </h2>
          <p className="text-ink/60 mb-6">
            Looking for pottery classes in other cities? Browse our directory to find 
            ceramic studios and workshops across {city.state}.
          </p>
          <Link href={`/pottery-classes/state/${city.state_slug}`} className="text-teal hover:text-clay font-medium">
            View all cities in {city.state} →
          </Link>
        </section>
      </div>
    </main>
  );
}