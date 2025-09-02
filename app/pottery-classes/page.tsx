import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseStatic } from '@/lib/db'
import { slugify, getStateSlug } from '@/lib/slugify'
import Button from '@/components/Button'
import HomepageSearch from '@/components/HomepageSearch'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Find Pottery Classes Near You | Nationwide Directory',
  description: 'Discover pottery classes, ceramic workshops, and clay studios across the United States. Find wheel throwing, hand-building, and glazing classes near you.',
  openGraph: {
    title: 'Find Pottery Classes Near You | Nationwide Directory',
    description: 'Discover pottery classes, ceramic workshops, and clay studios across the United States.',
    type: 'website',
  },
}

export default async function PotteryClassesHub() {
  const supabase = supabaseStatic()
  
  // Get all providers to extract unique cities and states
  const { data: providersData, error: providersError } = await supabase
    .from('providers_raw')
    .select('city, state')
  
  // Debug logging
  console.log('Providers data count:', providersData?.length || 0)
  if (providersError) {
    console.error('Providers error:', providersError)
  }
  
  // Create unique cities list with state info and count providers
  const citiesMap = new Map()
  providersData?.forEach((p: any) => {
    if (p.city && p.state) {
      const citySlug = slugify(p.city)
      const stateSlug = getStateSlug(p.state)
      const cityKey = `${citySlug}-${stateSlug}` // Unique key for each city-state combo
      
      if (!citiesMap.has(cityKey)) {
        citiesMap.set(cityKey, {
          city: p.city,
          state: p.state,
          city_slug: citySlug,
          state_slug: stateSlug,
          slug: citySlug, // for compatibility
          provider_count: 1
        })
      } else {
        const cityData = citiesMap.get(cityKey)
        cityData.provider_count++
      }
    }
  })
  
  console.log('Cities found:', citiesMap.size)
  
  // Get featured cities (top 16 by provider count)
  const featuredCities = Array.from(citiesMap.values())
    .sort((a, b) => b.provider_count - a.provider_count)
    .slice(0, 16)

  // Create unique states list with provider counts
  const statesMap = new Map()
  providersData?.forEach((p: any) => {
    if (p.state) {
      const stateSlug = getStateSlug(p.state)
      if (!statesMap.has(stateSlug)) {
        statesMap.set(stateSlug, {
          state: p.state,
          state_slug: stateSlug,
          provider_count: 1
        })
      } else {
        const stateData = statesMap.get(stateSlug)
        stateData.provider_count++
      }
    }
  })
  
  console.log('States found:', statesMap.size)
  
  // Get all unique states from providers
  const uniqueStates = Array.from(statesMap.values())
    .sort((a, b) => a.state.localeCompare(b.state))
  
  // Define all US states with their abbreviations
  const allStates = [
    { state: 'Alabama', state_slug: 'al' },
    { state: 'Alaska', state_slug: 'ak' },
    { state: 'Arizona', state_slug: 'az' },
    { state: 'Arkansas', state_slug: 'ar' },
    { state: 'California', state_slug: 'ca' },
    { state: 'Colorado', state_slug: 'co' },
    { state: 'Connecticut', state_slug: 'ct' },
    { state: 'Delaware', state_slug: 'de' },
    { state: 'Florida', state_slug: 'fl' },
    { state: 'Georgia', state_slug: 'ga' },
    { state: 'Hawaii', state_slug: 'hi' },
    { state: 'Idaho', state_slug: 'id' },
    { state: 'Illinois', state_slug: 'il' },
    { state: 'Indiana', state_slug: 'in' },
    { state: 'Iowa', state_slug: 'ia' },
    { state: 'Kansas', state_slug: 'ks' },
    { state: 'Kentucky', state_slug: 'ky' },
    { state: 'Louisiana', state_slug: 'la' },
    { state: 'Maine', state_slug: 'me' },
    { state: 'Maryland', state_slug: 'md' },
    { state: 'Massachusetts', state_slug: 'ma' },
    { state: 'Michigan', state_slug: 'mi' },
    { state: 'Minnesota', state_slug: 'mn' },
    { state: 'Mississippi', state_slug: 'ms' },
    { state: 'Missouri', state_slug: 'mo' },
    { state: 'Montana', state_slug: 'mt' },
    { state: 'Nebraska', state_slug: 'ne' },
    { state: 'Nevada', state_slug: 'nv' },
    { state: 'New Hampshire', state_slug: 'nh' },
    { state: 'New Jersey', state_slug: 'nj' },
    { state: 'New Mexico', state_slug: 'nm' },
    { state: 'New York', state_slug: 'ny' },
    { state: 'North Carolina', state_slug: 'nc' },
    { state: 'North Dakota', state_slug: 'nd' },
    { state: 'Ohio', state_slug: 'oh' },
    { state: 'Oklahoma', state_slug: 'ok' },
    { state: 'Oregon', state_slug: 'or' },
    { state: 'Pennsylvania', state_slug: 'pa' },
    { state: 'Rhode Island', state_slug: 'ri' },
    { state: 'South Carolina', state_slug: 'sc' },
    { state: 'South Dakota', state_slug: 'sd' },
    { state: 'Tennessee', state_slug: 'tn' },
    { state: 'Texas', state_slug: 'tx' },
    { state: 'Utah', state_slug: 'ut' },
    { state: 'Vermont', state_slug: 'vt' },
    { state: 'Virginia', state_slug: 'va' },
    { state: 'Washington', state_slug: 'wa' },
    { state: 'West Virginia', state_slug: 'wv' },
    { state: 'Wisconsin', state_slug: 'wi' },
    { state: 'Wyoming', state_slug: 'wy' }
  ]
  
  // Add provider counts to all states and sort by count (highest first)
  const allStatesWithCounts = allStates.map(state => {
    const stateData = statesMap.get(state.state_slug)
    return {
      ...state,
      provider_count: stateData?.provider_count || 0
    }
  }).sort((a, b) => {
    // Sort by provider count (descending), then alphabetically
    if (b.provider_count !== a.provider_count) {
      return b.provider_count - a.provider_count
    }
    return a.state.localeCompare(b.state)
  })

  return (
    <main className="min-h-screen bg-porcelain">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-clay/10 via-porcelain to-teal/10">
        {/* Hero Image */}
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
          <Image
            src="/WomanlearningPottery.webp"
            alt="Woman learning pottery on a wheel"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>
        
        {/* Hero Content - Positioned over the image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-white bg-clay/60 backdrop-blur-sm rounded-full">
              Discover Local Pottery Studios
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay to-teal">Pottery Classes</span> Near You
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-md">
              Connect with ceramic studios, master wheel throwing, and unleash your creativity 
              in pottery workshops across the United States.
            </p>
            
            {/* Enhanced Search Form */}
            <div className="max-w-2xl mx-auto">
              <HomepageSearch />
              
              {/* Quick Links */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm text-white/80">Popular searches:</span>
                <Link href="/pottery-classes/ny/new-york" className="text-sm text-white hover:text-teal transition-colors underline">
                  New York
                </Link>
                <span className="text-white/60">•</span>
                <Link href="/pottery-classes/ca/los-angeles" className="text-sm text-white hover:text-teal transition-colors underline">
                  Los Angeles
                </Link>
                <span className="text-white/60">•</span>
                <Link href="/pottery-classes/il/chicago" className="text-sm text-white hover:text-teal transition-colors underline">
                  Chicago
                </Link>
                <span className="text-white/60">•</span>
                <Link href="/pottery-classes/fl/miami" className="text-sm text-white hover:text-teal transition-colors underline">
                  Miami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Cities with Better Cards */}
      <section className="py-20 bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Popular Cities for Pottery Classes
            </h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              Explore pottery studios in major cities across the country
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredCities?.map((city) => (
              <Link 
                key={city.slug}
                href={`/pottery-classes/${city.state_slug}/${city.city_slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sand/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-ink group-hover:text-clay transition-colors">
                      {city.city}
                    </h3>
                    <svg className="w-5 h-5 text-teal group-hover:text-clay transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-ink/50">{city.state}</span>
                  <div className="mt-2 text-xs text-ink/60">
                    {city.provider_count} {city.provider_count === 1 ? 'studio' : 'studios'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/pottery-classes" className="inline-flex items-center gap-2 text-teal hover:text-clay transition-colors font-medium">
              View all cities
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Pottery Classes - Redesigned */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Why Take Pottery Classes?
            </h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              Discover the joy of creating with clay and join a thriving community of artists
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-clay/20 to-clay/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Creative Expression</h3>
              <p className="text-ink/60 leading-relaxed">
                Transform raw clay into functional art pieces that reflect your unique style
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal/20 to-teal/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Learn Ancient Craft</h3>
              <p className="text-ink/60 leading-relaxed">
                Master time-honored techniques passed down through generations
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-clay/20 to-clay/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Mindful Practice</h3>
              <p className="text-ink/60 leading-relaxed">
                Find peace and focus through the meditative process of working with clay
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal/20 to-teal/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Join Community</h3>
              <p className="text-ink/60 leading-relaxed">
                Connect with fellow artists and share your pottery journey
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Browse by State - Compact Design */}
      <section className="py-20 bg-white border-t border-sand/20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Browse by State
            </h2>
            <p className="text-lg text-ink/60">
              Find pottery classes in your state
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {allStatesWithCounts.map((state) => (
              <Link
                key={state.state}
                href={`/pottery-classes/state/${state.state_slug}`}
                className={`px-4 py-3 text-center rounded-lg transition-all duration-200 font-medium ${
                  state.provider_count > 0 
                    ? 'bg-porcelain hover:bg-clay hover:text-white text-ink' 
                    : 'bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200'
                }`}
              >
                {state.state}
                {state.provider_count > 0 && (
                  <span className="block text-xs opacity-70 mt-1">
                    ({state.provider_count})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}