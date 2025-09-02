// app/pottery-classes/zip/[zip]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { slugify, getStateSlug } from "@/lib/slugify";
import { formatHoursCompact } from "@/lib/formatHours";
import { filterByDistance } from "@/lib/distance";

export const dynamic = "force-dynamic"; // ensure params & query are respected

type Props = { 
  params: Promise<{ zip: string }>;
  searchParams: Promise<{ radius?: string; limit?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ zip: string }> }): Promise<Metadata> {
  const { zip: zipParam } = await params;
  const zip = zipParam?.slice(0, 5) ?? "";
  return {
    title: `Pottery Classes Near ${zip} | Find Local Studios`,
    description: `Discover pottery classes and ceramic studios near ZIP code ${zip}. Browse wheel throwing, hand-building, and glazing workshops in your area.`,
    robots: { index: false, follow: true }, // do not index results pages
  };
}

type ProviderRow = {
  id: number;
  name: string | null;
  site: string | null;
  phone_number: string | null;
  full_address: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_miles: number;
  review_stars?: number | null;
  review_count?: number | null;
  working_hours?: string | null;
};

export default async function ZipResultsPage({ params, searchParams }: Props) {
  const { zip: zipParam } = await params;
  const searchParamsData = await searchParams;
  
  const zip = (zipParam || "").slice(0, 5);
  const radius = Math.min(Math.max(Number(searchParamsData?.radius ?? 50), 1), 200);
  const limit = Math.min(Math.max(Number(searchParamsData?.limit ?? 500), 1), 1000);

  const supabase = await getSupabaseServer();
  
  // Get coordinates from the ZIP code database
  const { data: zipData } = await supabase
    .from('_zip_import')
    .select('lat, lng, city, state')
    .eq('zip', zip)
    .single();

  if (!zipData || !zipData.lat || !zipData.lng) {
    // If we can't find coordinates for this ZIP, show an error
    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="bg-white rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">ZIP Code Not Found</h1>
            <p className="text-ink/60 mb-6">
              We couldn't find location data for ZIP code {zip}.
            </p>
            <p className="text-ink/60 mb-4">
              This might mean the ZIP code is not in our database, or we don't have any pottery studios in that area.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                Browse All Cities
              </Link>
              <Link href="/search" className="text-teal hover:text-clay font-medium">
                Try Another Search
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Now fetch ALL providers with coordinates
  const { data: allProviders, error } = await supabase
    .from('providers_raw')
    .select('id, name, city, state, street, postal_code, phone_number, review_stars, review_count, working_hours, site, latitude, longitude')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="bg-white rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">Error Loading Results</h1>
            <p className="text-red-600 mb-6">{error.message}</p>
            <p className="text-ink/60 mb-4">
              There was an error loading the pottery studios. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                Browse All Cities
              </Link>
              <Link href="/search" className="text-teal hover:text-clay font-medium">
                Try Another Search
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Filter providers by distance from the ZIP code's coordinates
  const providers = filterByDistance(
    allProviders || [],
    zipData.lat,
    zipData.lng,
    radius
  ).slice(0, limit);

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header with radius controls */}
        <div className="mb-8">
          <nav className="text-sm mb-6">
            <Link href="/pottery-classes" className="text-teal hover:text-clay">
              All Cities
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">ZIP {zip}</span>
          </nav>
          
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-ink mb-2">
                Pottery Classes Near {zip}
              </h1>
              <p className="text-lg text-ink/70">
                Showing studios within {radius} miles
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink/60">Radius:</span>
              {[25, 50, 75, 100].map((r) => (
                <Link
                  key={r}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    r === radius 
                      ? "bg-teal text-white font-semibold" 
                      : "bg-sand/50 text-ink hover:bg-sand"
                  }`}
                  href={`/pottery-classes/zip/${zip}?radius=${r}`}
                >
                  {r} mi
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-ink/60 mb-4">
              No pottery studios found within {radius} miles of ZIP {zip}.
            </p>
            <div className="flex gap-4 justify-center">
              {radius < 200 && (
                <Link 
                  href={`/pottery-classes/zip/${zip}?radius=${Math.min(radius + 25, 200)}`} 
                  className="text-teal hover:text-clay font-medium"
                >
                  Increase search radius
                </Link>
              )}
              <Link href="/search" className="text-teal hover:text-clay font-medium">
                Try another search
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-ink/60 mb-6">
              Found {providers.length} pottery studio{providers.length !== 1 ? 's' : ''} near you
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider) => {
                const citySlug = slugify(provider.city);
                const stateSlug = getStateSlug(provider.state);
                const providerSlug = slugify(provider.name);
                
                return (
                  <div key={provider.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                    <div className="flex justify-between items-start mb-4">
                      <Link
                        href={`/pottery-classes/${stateSlug}/${citySlug}/${providerSlug}`}
                        className="block group flex-1"
                      >
                        <h2 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors">
                          {provider.name || "Pottery Studio"}
                        </h2>
                      </Link>
                      <span className="ml-4 px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-medium">
                        {provider.distance_miles.toFixed(1)} mi
                      </span>
                    </div>
                    
                    <div className="text-ink/60 space-y-1">
                      <p className="text-sm">
                        {provider.street && `${provider.street}, `}
                        {provider.city} {provider.state} {provider.postal_code}
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
                    
                    <div className="flex items-center justify-between mt-4">
                      <Link
                        href={`/pottery-classes/${stateSlug}/${citySlug}/${providerSlug}`}
                        className="inline-flex items-center gap-1 text-teal hover:text-clay transition-colors text-sm font-medium"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      
                      {provider.site && (
                        <a 
                          href={provider.site} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-teal hover:text-clay"
                        >
                          Website →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}