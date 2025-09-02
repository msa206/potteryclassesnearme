import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ZipSearch from '@/components/ZipSearch'

export const metadata: Metadata = {
  title: 'Search Pottery Classes',
  description: 'Search for pottery classes by city or ZIP code',
  robots: 'noindex, follow', // Search page should not be indexed
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
    // Try to find providers with this ZIP in providers_raw
    const providerResult = await supabase
      .from('providers_raw')
      .select('city_slug, state_slug')
      .eq('zip', cleanLocation)
      .limit(1)
      .single()
    
    const provider = providerResult.data as { city_slug: string; state_slug: string } | null
    
    if (provider?.city_slug && provider?.state_slug) {
      redirect(`/pottery-classes/${provider.state_slug}/${provider.city_slug}`)
    }
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
      redirect(`/pottery-classes/state/${stateSlug}`)
    }
  }
  
  // No matches found - redirect to main page
  redirect('/pottery-classes')
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>
}) {
  const params = await searchParams;
  
  // If there's a location in the URL, perform the search immediately
  if (params.location) {
    const formData = new FormData()
    formData.set('location', params.location)
    await searchLocation(formData)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold text-ink text-center mb-8">
          Search for Pottery Classes
        </h1>
        
        {/* City/State Search */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-4">Search by City or State</h2>
          <form action={searchLocation} className="space-y-4">
            <Input
              name="location"
              type="text"
              placeholder="Enter city name or state..."
              required
              label="Location"
              className="text-lg"
              defaultValue={params.location || ''}
            />
            
            <Button type="submit" variant="primary">
              Search by Location
            </Button>
          </form>
        </div>

        {/* ZIP Code Search */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-4">Search by ZIP Code</h2>
          <p className="text-ink/60 mb-4">Find pottery studios within a specific radius of your ZIP code.</p>
          <ZipSearch 
            defaultRadius={50}
            initialZip={/^\d{5}$/.test(params.location || '') ? params.location : ''}
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-ink/70 mb-4">Or browse by location:</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/pottery-classes"
              className="text-teal hover:text-clay transition-colors"
            >
              All Cities
            </Link>
            <span className="text-ink/40">•</span>
            <Link 
              href="/pottery-classes/state/ca"
              className="text-teal hover:text-clay transition-colors"
            >
              California
            </Link>
            <span className="text-ink/40">•</span>
            <Link 
              href="/pottery-classes/state/ny"
              className="text-teal hover:text-clay transition-colors"
            >
              New York
            </Link>
            <span className="text-ink/40">•</span>
            <Link 
              href="/pottery-classes/state/tx"
              className="text-teal hover:text-clay transition-colors"
            >
              Texas
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}