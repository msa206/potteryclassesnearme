import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import { slugify, getStateSlug, getStateNameFromSlug } from '@/lib/slugify'
import Button from '@/components/Button'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const zip = params.zip as string
  const location = params.location as string
  
  if (zip) {
    return {
      title: `Pottery Classes near ${zip} | Search Results`,
      description: `Find pottery studios and ceramic workshops near ZIP code ${zip}. Browse local classes for wheel throwing, hand-building, and glazing.`,
      robots: 'noindex, follow',
    }
  }

  if (location) {
    return {
      title: `Pottery Classes in ${location} | Search Results`,
      description: `Find pottery studios and ceramic workshops in ${location}. Browse local classes for wheel throwing, hand-building, and glazing.`,
      robots: 'noindex, follow',
    }
  }

  return {
    title: 'Search Pottery Classes',
    description: 'Search for pottery classes by city or ZIP code',
    robots: 'noindex, follow',
  }
}

async function searchLocation(formData: FormData) {
  'use server'
  
  const location = formData.get('location') as string
  if (!location) {
    redirect('/pottery-classes')
  }
  
  const cleanLocation = location.trim().toLowerCase()
  const supabase = supabaseStatic()
  
  // Check if it's a ZIP code (5 digits)
  if (/^\d{5}$/.test(cleanLocation)) {
    // Redirect to the ZIP search page with radius
    redirect(`/pottery-classes/zip/${cleanLocation}?radius=50`)
  }
  
  // Try to match city name from providers_raw
  const citiesResult = await supabase
    .from('providers_raw')
    .select('city, state_slug, city_slug')
    .ilike('city', `%${cleanLocation}%`)
  
  const providers = citiesResult.data as Array<{ city: string; state_slug: string; city_slug: string }> | null
  
  // Deduplicate by city_slug
  const uniqueCities = new Map()
  providers?.forEach(p => {
    if (p.city_slug && !uniqueCities.has(p.city_slug)) {
      uniqueCities.set(p.city_slug, p)
    }
  })
  
  const cities = Array.from(uniqueCities.values())
  
  if (cities.length === 1) {
    // Single city match
    redirect(`/pottery-classes/${cities[0].state_slug}/${cities[0].city_slug}`)
  }
  
  if (cities.length > 1) {
    // Multiple matches - try to find exact match
    const exactMatch = cities.find(c => c.city.toLowerCase() === cleanLocation)
    if (exactMatch) {
      redirect(`/pottery-classes/${exactMatch.state_slug}/${exactMatch.city_slug}`)
    }
    // Otherwise redirect to first match
    redirect(`/pottery-classes/${cities[0].state_slug}/${cities[0].city_slug}`)
  }
  
  // Try state search
  const stateAbbreviations: Record<string, string> = {
    'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar',
    'california': 'ca', 'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de',
    'florida': 'fl', 'georgia': 'ga', 'hawaii': 'hi', 'idaho': 'id',
    'illinois': 'il', 'indiana': 'in', 'iowa': 'ia', 'kansas': 'ks',
    'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
    'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms',
    'missouri': 'mo', 'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv',
    'new hampshire': 'nh', 'new jersey': 'nj', 'new mexico': 'nm', 'new york': 'ny',
    'north carolina': 'nc', 'north dakota': 'nd', 'ohio': 'oh', 'oklahoma': 'ok',
    'oregon': 'or', 'pennsylvania': 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
    'south dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut',
    'vermont': 'vt', 'virginia': 'va', 'washington': 'wa', 'west virginia': 'wv',
    'wisconsin': 'wi', 'wyoming': 'wy', 'district of columbia': 'dc', 'dc': 'dc'
  }
  
  const stateSlug = stateAbbreviations[cleanLocation] || cleanLocation
  if (stateSlug.length === 2) {
    // Check if this state exists
    const stateResult = await supabase
      .from('providers_raw')
      .select('state_slug')
      .eq('state_slug', stateSlug)
      .limit(1)
      .single()
    
    const stateData = stateResult.data as { state_slug: string } | null
    
    if (stateData) {
      redirect(`/pottery-classes/${stateSlug}`)
    }
  }
  
  // No matches found - redirect to main page
  redirect('/pottery-classes')
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const zip = params.zip as string
  const radius = (params.radius as string) || '50'
  const location = params.location as string
  const error = params.error as string

  // Handle ZIP search results
  if (zip && /^\d{5}$/.test(zip)) {
    const supabase = supabaseStatic()
    
    // Search for providers with matching ZIP codes
    const { data: providers, error: dbError } = await supabase
      .from('providers_raw')
      .select('id, name, city, state, street, postal_code, phone_number, review_stars, review_count')
      .eq('postal_code', zip)
      .order('review_count', { ascending: false, nullsFirst: false })
      .limit(100)

    if (dbError) {
      console.error('Database error:', dbError)
    }

    const studios = (providers || []).map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      provider_slug: slugify(provider.name),
      city: provider.city,
      state: provider.state,
      city_slug: slugify(provider.city),
      state_slug: getStateSlug(provider.state),
      distance_miles: 0, // We don't have distance calculation without PostGIS
      rating: provider.review_stars,
      review_count: provider.review_count,
      street: provider.street,
      zip: provider.postal_code,
      phone: provider.phone_number,
    }))

    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <Link href="/" className="text-teal hover:text-clay">
              Home
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">Search Results</span>
          </nav>

          <h1 className="text-4xl font-bold text-ink mb-6">
            Pottery Classes near {zip}
          </h1>
          
          {studios.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-lg text-ink/60 mb-4">
                No pottery studios found in ZIP code {zip}.
              </p>
              <p className="text-ink/50 mb-6">
                Try searching a different ZIP code or browse by state.
              </p>
              <div className="space-y-4">
                <Link href="/" className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-clay transition-colors font-medium">
                  Try Another Search
                </Link>
                <div>
                  <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                    Browse All States
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg text-ink/70 mb-8 max-w-3xl">
                Found {studios.length} pottery studio{studios.length === 1 ? '' : 's'} in ZIP code {zip}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studios.map((studio) => {
                  const href = `/pottery-classes/${studio.state_slug}/${studio.city_slug}/${studio.provider_slug}`

                  return (
                    <div key={studio.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={href} className="block group flex-1">
                          <h2 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors">
                            {studio.name}
                          </h2>
                        </Link>
                      </div>
                      
                      <div className="text-ink/60 space-y-1">
                        {studio.street && (
                          <p className="text-sm">
                            {studio.street}, {studio.city}, {getStateNameFromSlug(studio.state_slug)} {studio.zip}
                          </p>
                        )}
                        
                        {!studio.street && (
                          <p className="text-sm">
                            {studio.city}, {getStateNameFromSlug(studio.state_slug)}
                          </p>
                        )}
                        
                        {studio.phone && (
                          <p className="text-sm">
                            <a href={`tel:${studio.phone}`} className="hover:text-teal">
                              {studio.phone}
                            </a>
                          </p>
                        )}
                        
                        {studio.rating != null && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium text-ink">
                              {Number(studio.rating).toFixed(1)}
                            </span>
                            <span className="text-sm text-ink/50">
                              ({studio.review_count || 0} review{studio.review_count !== 1 ? 's' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1 mt-4 text-teal hover:text-clay transition-colors text-sm font-medium"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Related Links */}
          <section className="mt-16 pt-12 border-t border-sand/20">
            <h2 className="text-2xl font-semibold text-ink mb-6">
              Explore More Pottery Classes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-ink mb-3">Popular Cities</h3>
                <div className="space-y-2">
                  <Link href="/pottery-classes/ny/new-york" className="block text-teal hover:text-clay">
                    New York, NY
                  </Link>
                  <Link href="/pottery-classes/ca/los-angeles" className="block text-teal hover:text-clay">
                    Los Angeles, CA
                  </Link>
                  <Link href="/pottery-classes/il/chicago" className="block text-teal hover:text-clay">
                    Chicago, IL
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-3">Browse by State</h3>
                <Link href="/pottery-classes" className="text-teal hover:text-clay font-medium">
                  View all states →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }
  
  // If there's a location in the URL, perform the search immediately
  if (location) {
    const formData = new FormData()
    formData.set('location', location)
    await searchLocation(formData)
  }

  // Handle error messages
  const errorMessages = {
    'invalid-zip': 'Please enter a valid 5-digit ZIP code.',
    'search-failed': 'Search failed. Please try again.',
    'no-results': `No pottery studios found${zip ? ` in ZIP code ${zip}` : ''}.`,
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4">
            Search by Zipcode
          </h1>
          <p className="text-lg text-ink/60">
            Find pottery studios and ceramic workshops by zipcode
          </p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center">
              {errorMessages[error as keyof typeof errorMessages] || 'An error occurred. Please try again.'}
            </p>
          </div>
        )}
        
        {/* Unified Search Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-ink/10 p-8 mb-12">
          <form action={searchLocation} className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-ink mb-2">
                Enter a zipcode
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter 5-digit ZIP code..."
                required
                className="w-full px-5 py-3 border border-sand/50 rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all text-lg"
                defaultValue={location || ''}
                autoFocus
              />
              <p className="mt-2 text-sm text-ink/50">
                Examples: "90210", "10001", "60601"
              </p>
            </div>
            
            <Button type="submit" variant="primary" className="w-full text-lg py-3">
              Search Pottery Classes
            </Button>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="bg-white/50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-ink mb-6 text-center">
            Popular Searches
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-ink mb-4">Major Cities</h3>
              <div className="space-y-2">
                <Link 
                  href="/pottery-classes/new-york/new-york" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → New York, NY
                </Link>
                <Link 
                  href="/pottery-classes/california/los-angeles" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Los Angeles, CA
                </Link>
                <Link 
                  href="/pottery-classes/illinois/chicago" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Chicago, IL
                </Link>
                <Link 
                  href="/pottery-classes/texas/houston" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Houston, TX
                </Link>
                <Link 
                  href="/pottery-classes/florida/miami" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Miami, FL
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-ink mb-4">Popular States</h3>
              <div className="space-y-2">
                <Link 
                  href="/pottery-classes/california" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → California
                </Link>
                <Link 
                  href="/pottery-classes/new-york" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → New York
                </Link>
                <Link 
                  href="/pottery-classes/texas" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Texas
                </Link>
                <Link 
                  href="/pottery-classes/florida" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Florida
                </Link>
                <Link 
                  href="/pottery-classes/illinois" 
                  className="block text-teal hover:text-clay transition-colors hover:translate-x-1 transform duration-200"
                >
                  → Illinois
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-sand/20 text-center">
            <Link 
              href="/pottery-classes"
              className="inline-flex items-center gap-2 text-teal hover:text-clay font-medium transition-colors"
            >
              Browse All Locations
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}