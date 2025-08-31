import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import Card from '@/components/Card'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h ISR

// State name mapping
const stateNames: Record<string, string> = {
  'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas',
  'ca': 'California', 'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware',
  'fl': 'Florida', 'ga': 'Georgia', 'hi': 'Hawaii', 'id': 'Idaho',
  'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa', 'ks': 'Kansas',
  'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
  'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi',
  'mo': 'Missouri', 'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada',
  'nh': 'New Hampshire', 'nj': 'New Jersey', 'nm': 'New Mexico', 'ny': 'New York',
  'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio', 'ok': 'Oklahoma',
  'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
  'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah',
  'vt': 'Vermont', 'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia',
  'wi': 'Wisconsin', 'wy': 'Wyoming', 'dc': 'District of Columbia'
}

interface PageProps {
  params: Promise<{ stateSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stateSlug } = await params
  const stateName = stateNames[stateSlug] || stateSlug.toUpperCase()
  
  const title = `Pottery Classes in ${stateName} | Find Studios & Workshops`
  const description = `Discover pottery classes throughout ${stateName}. Browse ceramic studios and clay workshops in cities across the state.`
  
  return {
    title,
    description,
    alternates: { canonical: `/pottery-classes/state/${stateSlug}` },
    openGraph: { 
      title, 
      description,
      type: 'website',
    }
  }
}

export default async function StatePage({ params }: PageProps) {
  const { stateSlug } = await params
  const supabase = supabaseStatic()
  const stateName = stateNames[stateSlug]
  
  if (!stateName) {
    return notFound()
  }

  // Get all cities in this state
  const citiesResult = await supabase
    .from('cities')
    .select('slug, city, state')
    .eq('state_slug', stateSlug)
    .order('city')

  const cities = citiesResult.data as Array<{ slug: string; city: string; state: string }> | null

  if (!cities || cities.length === 0) {
    return notFound()
  }

  // Get provider counts for each city
  const providerCountsResult = await supabase
    .from('providers')
    .select('city_slug')
    .in('city_slug', cities.map(c => c.slug))
  
  const providerCounts = providerCountsResult.data as Array<{ city_slug: string }> | null
  
  const countsMap = providerCounts?.reduce((acc, p) => {
    acc[p.city_slug] = (acc[p.city_slug] || 0) + 1
    return acc
  }, {} as Record<string, number>) ?? {}

  // Get total provider count for the state
  const totalProviders = Object.values(countsMap).reduce((sum, count) => sum + count, 0)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-10 bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="text-sm mb-4">
            <Link href="/pottery-classes" className="text-teal hover:text-clay">
              Pottery Classes
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">{stateName}</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            Pottery Classes in {stateName}
          </h1>
          
          <p className="text-lg text-ink/80">
            Explore {totalProviders} pottery studios and ceramic workshops across {cities.length} cities in {stateName}. 
            Find the perfect class for wheel throwing, hand-building, glazing, and more.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold text-ink mb-8">
            Cities with Pottery Classes in {stateName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => {
              const count = countsMap[city.slug] || 0
              return (
                <Card key={city.slug} className="hover:shadow-md transition-shadow">
                  <Link 
                    href={`/pottery-classes/${city.slug}`}
                    className="block"
                  >
                    <h3 className="text-lg font-medium text-ink mb-1">
                      {city.city}
                    </h3>
                    <p className="text-sm text-ink/60">
                      {count} {count === 1 ? 'studio' : 'studios'}
                    </p>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* State Information */}
      <section className="py-12 bg-white border-t border-sand">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            About Pottery Classes in {stateName}
          </h2>
          
          <div className="prose prose-slate max-w-none">
            <p>
              {stateName} offers a diverse range of pottery classes and ceramic workshops 
              suitable for all skill levels. From bustling urban studios to peaceful rural 
              workshops, you&apos;ll find experienced instructors ready to guide you through the 
              art of working with clay.
            </p>
            
            <h3>Popular Pottery Techniques in {stateName}</h3>
            <ul>
              <li>Wheel throwing - Learn to center clay and create bowls, mugs, and vases</li>
              <li>Hand-building - Master pinch pots, coil building, and slab construction</li>
              <li>Glazing - Explore various glazing techniques and surface decorations</li>
              <li>Raku firing - Experience this dramatic Japanese firing technique</li>
              <li>Sculptural ceramics - Create artistic pieces beyond functional pottery</li>
            </ul>
            
            <h3>What to Look for in a Pottery Class</h3>
            <p>
              When choosing a pottery class in {stateName}, consider factors such as class size, 
              instructor experience, studio equipment, and whether materials are included. Many 
              studios offer both drop-in sessions and multi-week courses, allowing you to choose 
              the format that best fits your schedule and learning goals.
            </p>
          </div>
        </div>
      </section>

      {/* Nearby States */}
      <section className="py-10 bg-gradient-to-b from-white to-porcelain">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold text-ink mb-4">
            Explore Pottery Classes in Nearby States
          </h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(stateNames)
              .filter(([slug]) => slug !== stateSlug)
              .slice(0, 8)
              .map(([slug, name]) => (
                <Link 
                  key={slug}
                  href={`/pottery-classes/state/${slug}`}
                  className="text-teal hover:text-clay transition-colors"
                >
                  {name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// Generate static params for all states
export async function generateStaticParams() {
  return Object.keys(stateNames).map(stateSlug => ({ stateSlug }))
}