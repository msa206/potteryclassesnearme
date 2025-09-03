import { Metadata } from "next";
import Link from "next/link";
import { supabaseStatic } from "@/lib/db";
import { slugify, getStateSlug, getStateNameFromSlug } from "@/lib/slugify";
import { getNearbyStates } from "@/lib/nearbyStates";
import stateContent from "@/lib/stateContent";

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ state: string }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateName = getStateNameFromSlug(stateSlug);
  
  const title = `Pottery Classes in ${stateName} | Find Ceramic Studios`;
  const description = `Browse pottery studios and ceramic workshops across ${stateName}. Find wheel throwing, hand-building, and glazing classes in cities throughout the state.`;
  const canonical = `https://localpotteryclasses.com/pottery-classes/${stateSlug}/`;
  
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

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateName = getStateNameFromSlug(stateSlug);
  
  const supabase = supabaseStatic();
  
  // Get all providers for this state
  const { data: providersData } = await supabase
    .from('providers_raw')
    .select('city, state, name')
    .order('city');
  
  // Filter providers by state and extract unique cities
  const citiesMap = new Map();
  let providerCount = 0;
  
  providersData?.forEach((p: any) => {
    const pStateSlug = getStateSlug(p.state);
    if (pStateSlug === stateSlug) {
      providerCount++;
      if (p.city) {
        const citySlug = slugify(p.city);
        if (!citiesMap.has(citySlug)) {
          citiesMap.set(citySlug, {
            city: p.city,
            city_slug: citySlug,
            provider_count: 1
          });
        } else {
          const cityData = citiesMap.get(citySlug);
          cityData.provider_count++;
        }
      }
    }
  });
  
  const cities = Array.from(citiesMap.values())
    .sort((a, b) => a.city.localeCompare(b.city));

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/" className="text-teal hover:text-clay">
            Home
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">{stateName}</span>
        </nav>

        <h1 className="text-4xl font-bold text-ink mb-6">
          Pottery Classes in {stateName}
        </h1>
        
        <p className="text-lg text-ink/70 mb-8 max-w-3xl">
          Explore {providerCount} pottery studio{providerCount !== 1 ? 's' : ''} across {cities.length} cit{cities.length !== 1 ? 'ies' : 'y'} in {stateName}. 
          From beginner-friendly workshops to advanced ceramic techniques, find the perfect pottery class near you.
        </p>

        {cities.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-ink/60">No pottery studios found in this state yet.</p>
            <Link href="/search" className="inline-block mt-4 text-teal hover:text-clay">
              Search other states
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city.city_slug}
                href={`/pottery-classes/${stateSlug}/${city.city_slug}`}
                className="block group"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                  <h2 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors mb-2">
                    {city.city}
                  </h2>
                  <p className="text-ink/60 text-sm">
                    {city.provider_count} pottery studio{city.provider_count !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-teal group-hover:text-clay transition-colors text-sm font-medium">
                    View Studios
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* State-specific pottery content - 350 words max per state */}
        {stateContent[stateSlug]}

        {/* Nearby States */}
        <section className="mt-16 pt-12 border-t border-sand/20">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Pottery Classes in Nearby States
          </h2>
          {(() => {
            const nearbyStatesList = getNearbyStates(stateSlug);
            if (nearbyStatesList.length === 0) {
              return (
                <div>
                  <p className="text-ink/60 mb-6">
                    Explore pottery classes across the United States.
                  </p>
                  <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                    View all states →
                  </Link>
                </div>
              );
            }
            return (
              <>
                <p className="text-ink/60 mb-6">
                  Continue exploring pottery studios and ceramic workshops in states neighboring {stateName}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {nearbyStatesList.map((nearbyState) => (
                    <Link
                      key={nearbyState.slug}
                      href={`/pottery-classes/${nearbyState.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-sand/20 group-hover:border-teal/30">
                        <h3 className="font-medium text-ink group-hover:text-teal transition-colors">
                          {nearbyState.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-teal/60 group-hover:text-teal transition-colors text-sm">
                          View studios
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                  Browse all states →
                </Link>
              </>
            );
          })()}
        </section>
      </div>
    </main>
  );
}