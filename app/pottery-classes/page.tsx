import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseStatic } from '@/lib/db'
import Button from '@/components/Button'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h ISR

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
  
  // Get featured cities with most providers
  const { data: citiesData, error: citiesError } = await supabase
    .from('cities')
    .select('slug, city, state')
    .order('city')
    .limit(16)
  
  const featuredCities = citiesData as Array<{ slug: string; city: string; state: string }> | null

  // Get states with pottery classes
  const { data: statesData, error: statesError } = await supabase
    .from('cities')
    .select('state, state_slug')
    .order('state')
  
  // Log errors for debugging
  if (citiesError) {
    console.error('Error fetching cities:', citiesError)
  }
  if (statesError) {
    console.error('Error fetching states:', statesError)
  }
  
  const states = statesData as Array<{ state: string; state_slug: string }> | null
  
  // Deduplicate states
  const uniqueStates = states ? Array.from(new Set(states.map(s => s.state))).map(state => {
    const stateData = states.find(s => s.state === state)
    return { state, state_slug: stateData?.state_slug }
  }) : []

  return (
    <main className="min-h-screen bg-porcelain">
      {/* Hero Section with Better Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-clay/10 via-porcelain to-teal/10 py-24">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-clay/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-clay bg-clay/10 rounded-full">
              Discover Local Pottery Studios
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay to-teal">
                Pottery Class
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-ink/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with ceramic studios, master wheel throwing, and unleash your creativity 
              in pottery workshops across the United States.
            </p>
            
            {/* Enhanced Search Form */}
            <div className="max-w-2xl mx-auto">
              <form action="/search" method="GET" className="relative">
                <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-ink/10">
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter city, state, or ZIP code..."
                    className="flex-1 px-6 py-4 text-lg bg-transparent outline-none placeholder:text-ink/40"
                    required
                  />
                  <Button type="submit" variant="primary" className="px-8 py-4 text-lg font-semibold rounded-xl">
                    Search Classes
                  </Button>
                </div>
              </form>
              
              {/* Quick Links */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm text-ink/60">Popular searches:</span>
                <Link href="/pottery-classes/new-york-ny" className="text-sm text-teal hover:text-clay transition-colors">
                  New York
                </Link>
                <span className="text-ink/30">•</span>
                <Link href="/pottery-classes/los-angeles-ca" className="text-sm text-teal hover:text-clay transition-colors">
                  Los Angeles
                </Link>
                <span className="text-ink/30">•</span>
                <Link href="/pottery-classes/chicago-il" className="text-sm text-teal hover:text-clay transition-colors">
                  Chicago
                </Link>
                <span className="text-ink/30">•</span>
                <Link href="/pottery-classes/miami" className="text-sm text-teal hover:text-clay transition-colors">
                  Miami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Cities with Better Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-porcelain">
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
                href={`/pottery-classes/${city.slug}`}
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
            {uniqueStates.slice(0, 24).map((state) => (
              <Link
                key={state.state}
                href={`/pottery-classes/state/${state.state_slug}`}
                className="px-4 py-3 text-center bg-porcelain hover:bg-clay hover:text-white rounded-lg transition-all duration-200 font-medium text-ink"
              >
                {state.state}
              </Link>
            ))}
          </div>
          
          {uniqueStates.length > 24 && (
            <div className="text-center mt-8">
              <details className="inline-block">
                <summary className="cursor-pointer text-teal hover:text-clay transition-colors font-medium">
                  Show all {uniqueStates.length} states
                </summary>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mt-4">
                  {uniqueStates.slice(24).map((state) => (
                    <Link
                      key={state.state}
                      href={`/pottery-classes/state/${state.state_slug}`}
                      className="px-4 py-3 text-center bg-porcelain hover:bg-clay hover:text-white rounded-lg transition-all duration-200 font-medium text-ink"
                    >
                      {state.state}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-clay to-teal">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Pottery Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Find the perfect pottery class near you and begin creating today
          </p>
          <Link 
            href="/search"
            className="inline-block px-8 py-4 bg-white text-clay font-semibold rounded-xl hover:bg-porcelain transition-colors text-lg"
          >
            Find Classes Now
          </Link>
        </div>
      </section>
    </main>
  )
}