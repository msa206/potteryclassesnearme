import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseStatic } from '@/lib/db'
import { getStateSlug } from '@/lib/slugify'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pottery Classes by State | Browse All States',
  description: 'Find pottery classes, ceramic workshops, and clay studios in all 50 states. Browse our complete directory organized by state.',
  alternates: { canonical: 'https://localpotteryclasses.com/pottery-classes/' },
  openGraph: {
    title: 'Pottery Classes by State | Browse All States',
    description: 'Find pottery classes and ceramic workshops in all 50 states.',
    type: 'website',
  },
}

export default async function StatesPage() {
  const supabase = supabaseStatic()
  
  // Get all providers to count by state
  const { data: providersData, error: providersError } = await supabase
    .from('providers_raw')
    .select('state')
  
  if (providersError) {
    console.error('Error fetching providers:', providersError)
  }
  
  // Create state counts
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
  
  // Define all US states with their full slugs
  const allStates = [
    { state: 'Alabama', state_slug: 'alabama' },
    { state: 'Alaska', state_slug: 'alaska' },
    { state: 'Arizona', state_slug: 'arizona' },
    { state: 'Arkansas', state_slug: 'arkansas' },
    { state: 'California', state_slug: 'california' },
    { state: 'Colorado', state_slug: 'colorado' },
    { state: 'Connecticut', state_slug: 'connecticut' },
    { state: 'Delaware', state_slug: 'delaware' },
    { state: 'Florida', state_slug: 'florida' },
    { state: 'Georgia', state_slug: 'georgia' },
    { state: 'Hawaii', state_slug: 'hawaii' },
    { state: 'Idaho', state_slug: 'idaho' },
    { state: 'Illinois', state_slug: 'illinois' },
    { state: 'Indiana', state_slug: 'indiana' },
    { state: 'Iowa', state_slug: 'iowa' },
    { state: 'Kansas', state_slug: 'kansas' },
    { state: 'Kentucky', state_slug: 'kentucky' },
    { state: 'Louisiana', state_slug: 'louisiana' },
    { state: 'Maine', state_slug: 'maine' },
    { state: 'Maryland', state_slug: 'maryland' },
    { state: 'Massachusetts', state_slug: 'massachusetts' },
    { state: 'Michigan', state_slug: 'michigan' },
    { state: 'Minnesota', state_slug: 'minnesota' },
    { state: 'Mississippi', state_slug: 'mississippi' },
    { state: 'Missouri', state_slug: 'missouri' },
    { state: 'Montana', state_slug: 'montana' },
    { state: 'Nebraska', state_slug: 'nebraska' },
    { state: 'Nevada', state_slug: 'nevada' },
    { state: 'New Hampshire', state_slug: 'new-hampshire' },
    { state: 'New Jersey', state_slug: 'new-jersey' },
    { state: 'New Mexico', state_slug: 'new-mexico' },
    { state: 'New York', state_slug: 'new-york' },
    { state: 'North Carolina', state_slug: 'north-carolina' },
    { state: 'North Dakota', state_slug: 'north-dakota' },
    { state: 'Ohio', state_slug: 'ohio' },
    { state: 'Oklahoma', state_slug: 'oklahoma' },
    { state: 'Oregon', state_slug: 'oregon' },
    { state: 'Pennsylvania', state_slug: 'pennsylvania' },
    { state: 'Rhode Island', state_slug: 'rhode-island' },
    { state: 'South Carolina', state_slug: 'south-carolina' },
    { state: 'South Dakota', state_slug: 'south-dakota' },
    { state: 'Tennessee', state_slug: 'tennessee' },
    { state: 'Texas', state_slug: 'texas' },
    { state: 'Utah', state_slug: 'utah' },
    { state: 'Vermont', state_slug: 'vermont' },
    { state: 'Virginia', state_slug: 'virginia' },
    { state: 'Washington', state_slug: 'washington' },
    { state: 'West Virginia', state_slug: 'west-virginia' },
    { state: 'Wisconsin', state_slug: 'wisconsin' },
    { state: 'Wyoming', state_slug: 'wyoming' }
  ]
  
  // Add provider counts to all states
  const allStatesWithCounts = allStates.map(state => {
    const stateData = statesMap.get(state.state_slug)
    return {
      ...state,
      provider_count: stateData?.provider_count || 0
    }
  })
  
  // Separate states with and without studios
  const statesWithStudios = allStatesWithCounts
    .filter(s => s.provider_count > 0)
    .sort((a, b) => b.provider_count - a.provider_count)
  
  const statesWithoutStudios = allStatesWithCounts
    .filter(s => s.provider_count === 0)
    .sort((a, b) => a.state.localeCompare(b.state))
  
  const totalStates = statesWithStudios.length
  const totalStudios = providersData?.length || 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-teal hover:text-clay transition-colors">
            Home
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">All States</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Pottery Classes by State
          </h1>
          <p className="text-lg text-ink/70 max-w-3xl mx-auto mb-6">
            Browse pottery studios and ceramic workshops across all 50 states. 
            Find the perfect pottery class in your state or explore studios nationwide.
          </p>
          
          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-clay">{totalStates}</div>
              <div className="text-sm text-ink/60">States with Studios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal">{totalStudios}</div>
              <div className="text-sm text-ink/60">Total Studios</div>
            </div>
          </div>
        </div>

        {/* States with Studios */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            States with Pottery Studios
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {statesWithStudios.map((state) => (
              <Link
                key={state.state_slug}
                href={`/pottery-classes/${state.state_slug}`}
                className="group"
              >
                <div className="p-4 bg-white rounded-lg hover:bg-clay hover:text-white border border-sand/20 hover:border-clay transition-all duration-200 text-center">
                  <h3 className="font-medium text-ink group-hover:text-white">
                    {state.state}
                  </h3>
                  <p className="text-sm text-ink/60 group-hover:text-white/80 mt-1">
                    {state.provider_count} {state.provider_count === 1 ? 'studio' : 'studios'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* States without Studios (if any) */}
        {statesWithoutStudios.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Coming Soon
            </h2>
            <p className="text-ink/60 mb-6">
              We're actively adding studios in these states. Check back soon or contact us if you know of studios we should include.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {statesWithoutStudios.map((state) => (
                <div
                  key={state.state_slug}
                  className="px-4 py-3 text-center rounded-lg bg-gray-100 text-gray-400"
                >
                  {state.state}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-clay/10 to-teal/10 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">
            Looking for a Specific City?
          </h2>
          <p className="text-ink/70 mb-6 max-w-2xl mx-auto">
            Browse all cities with pottery studios or search by ZIP code to find classes near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/all-cities"
              className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-lg hover:bg-clay/90 transition-colors"
            >
              View All Cities
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 bg-teal text-white px-6 py-3 rounded-lg hover:bg-teal/90 transition-colors"
            >
              Search by ZIP
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}