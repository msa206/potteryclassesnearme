import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import Button from '@/components/Button'
import Input from '@/components/Input'

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
    // Look up ZIP mapping
    const zipResult = await supabase
      .from('zip_mappings')
      .select('city_slug')
      .eq('zip', cleanLocation)
      .single()
    
    const zipMapping = zipResult.data as { city_slug: string } | null
    
    if (zipMapping?.city_slug) {
      redirect(`/pottery-classes/${zipMapping.city_slug}`)
    }
    
    // Try to find providers with this ZIP
    const providerResult = await supabase
      .from('providers')
      .select('city_slug')
      .eq('zip', cleanLocation)
      .limit(1)
      .single()
    
    const provider = providerResult.data as { city_slug: string } | null
    
    if (provider?.city_slug) {
      redirect(`/pottery-classes/${provider.city_slug}`)
    }
  }
  
  // Try to match city name
  const citiesResult = await supabase
    .from('cities')
    .select('slug, city')
    .ilike('city', `%${cleanLocation}%`)
    .limit(5)
  
  const cities = citiesResult.data as Array<{ slug: string; city: string }> | null
  
  if (cities && cities.length === 1) {
    // Exact match or single result
    redirect(`/pottery-classes/${cities[0].slug}`)
  }
  
  if (cities && cities.length > 1) {
    // Multiple matches - try to find exact match
    const exactMatch = cities.find(c => c.city.toLowerCase() === cleanLocation)
    if (exactMatch) {
      redirect(`/pottery-classes/${exactMatch.slug}`)
    }
    // Otherwise redirect to first match
    redirect(`/pottery-classes/${cities[0].slug}`)
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
    const stateCityResult = await supabase
      .from('cities')
      .select('state_slug')
      .eq('state_slug', stateSlug)
      .limit(1)
      .single()
    
    const stateCity = stateCityResult.data as { state_slug: string } | null
    
    if (stateCity) {
      redirect(`/pottery-classes/state/${stateSlug}`)
    }
  }
  
  // No matches found - redirect to main page
  redirect('/pottery-classes')
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold text-ink text-center mb-8">
          Search for Pottery Classes
        </h1>
        
        <form action={searchLocation} className="space-y-4">
          <Input
            name="location"
            type="text"
            placeholder="Enter city name or ZIP code..."
            required
            label="Location"
            className="text-lg"
          />
          
          <Button type="submit" variant="primary">
            Search Classes
          </Button>
        </form>
        
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