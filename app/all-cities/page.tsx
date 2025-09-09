import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseStatic } from '@/lib/db'
import { slugify, getStateSlug, getStateNameFromSlug } from '@/lib/slugify'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Cities with Pottery Classes | A-Z Directory',
  description: 'Browse our alphabetical directory of cities with pottery classes, ceramic workshops, and clay studios across the United States.',
  alternates: { canonical: 'https://localpotteryclasses.com/all-cities' },
  openGraph: {
    title: 'All Cities with Pottery Classes | A-Z Directory',
    description: 'Browse our alphabetical directory of cities with pottery classes across the United States.',
    type: 'website',
    url: 'https://localpotteryclasses.com/all-cities',
    siteName: 'Local Pottery Classes',
    images: [
      {
        url: 'https://localpotteryclasses.com/localpotteryclasses_socialimage.png',
        width: 1200,
        height: 630,
        alt: 'All Cities with Pottery Classes',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Cities with Pottery Classes | A-Z Directory',
    description: 'Browse our alphabetical directory of cities with pottery classes across the United States.',
    images: ['https://localpotteryclasses.com/localpotteryclasses_socialimage.png'],
  },
}

export default async function AllCitiesPage() {
  const supabase = supabaseStatic()
  
  // Get all providers to extract unique cities and states
  const { data: providersData, error: providersError } = await supabase
    .from('providers_raw')
    .select('city, state')
  
  if (providersError) {
    console.error('Error fetching providers:', providersError)
  }
  
  // Create unique cities list with state info and count providers
  const citiesMap = new Map()
  providersData?.forEach((p: any) => {
    if (p.city && p.state) {
      const citySlug = slugify(p.city)
      const stateSlug = getStateSlug(p.state)
      const cityKey = `${citySlug}-${stateSlug}`
      
      if (!citiesMap.has(cityKey)) {
        citiesMap.set(cityKey, {
          city: p.city,
          state: p.state,
          city_slug: citySlug,
          state_slug: stateSlug,
          provider_count: 1
        })
      } else {
        const cityData = citiesMap.get(cityKey)
        cityData.provider_count++
      }
    }
  })
  
  // Create array of all cities and sort alphabetically
  const allCities = Array.from(citiesMap.values())
    .sort((a, b) => a.city.localeCompare(b.city))
  
  // Group cities by first letter
  const citiesByLetter = new Map<string, any[]>()
  allCities.forEach(city => {
    const firstLetter = city.city.charAt(0).toUpperCase()
    if (!citiesByLetter.has(firstLetter)) {
      citiesByLetter.set(firstLetter, [])
    }
    citiesByLetter.get(firstLetter)?.push(city)
  })
  
  // Create array of letters with cities
  const alphabeticalGroups = Array.from(citiesByLetter.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, cities]) => ({
      letter,
      cities
    }))
  
  const totalCities = citiesMap.size
  const totalStudios = providersData?.length || 0
  const totalStates = new Set(allCities.map(c => c.state_slug)).size
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-teal hover:text-clay transition-colors">
            Home
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">All Cities</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Pottery Classes by City
          </h1>
          <p className="text-lg text-ink/70 max-w-3xl mx-auto mb-6">
            Browse pottery studios and ceramic workshops in {totalCities} cities across the United States.
            Find the perfect pottery class in your city or explore studios nationwide.
          </p>
          
          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-clay">{totalCities}</div>
              <div className="text-sm text-ink/60">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal">{totalStudios}</div>
              <div className="text-sm text-ink/60">Studios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ink">{totalStates}</div>
              <div className="text-sm text-ink/60">States</div>
            </div>
          </div>
        </div>

        {/* Alphabet Navigation */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex flex-wrap justify-center gap-2">
            {alphabeticalGroups.map(({ letter }) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-porcelain hover:bg-clay hover:text-white text-ink font-semibold transition-all duration-200"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Cities by Letter */}
        <div className="space-y-12">
          {alphabeticalGroups.map(({ letter, cities }) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-clay text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                  {letter}
                </div>
                <div className="flex-1 h-px bg-sand/30"></div>
                <span className="text-sm text-ink/60">{cities.length} {cities.length === 1 ? 'city' : 'cities'}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => {
                  const stateName = getStateNameFromSlug(city.state_slug)
                  return (
                    <Link
                      key={`${city.city_slug}-${city.state_slug}`}
                      href={`/pottery-classes/${city.state_slug}/${city.city_slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-sand/20 hover:border-teal/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-ink group-hover:text-teal transition-colors">
                              {city.city}
                            </h3>
                            <p className="text-sm text-ink/60 mt-1">
                              {stateName}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-clay/80">
                              {city.provider_count}
                            </span>
                            <p className="text-xs text-ink/50">
                              {city.provider_count === 1 ? 'studio' : 'studios'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-3 text-teal group-hover:text-clay transition-colors text-sm">
                          View studios
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-clay/10 to-teal/10 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">
            Can't Find Your City?
          </h2>
          <p className="text-ink/70 mb-6 max-w-2xl mx-auto">
            Try searching by ZIP code or browse studios by state to find pottery classes near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-lg hover:bg-clay/90 transition-colors"
            >
              Search by ZIP
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link 
              href="/pottery-classes"
              className="inline-flex items-center gap-2 bg-teal text-white px-6 py-3 rounded-lg hover:bg-teal/90 transition-colors"
            >
              Browse by State
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}