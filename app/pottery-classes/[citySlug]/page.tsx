import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import { readCityIntroMdx, readCityFaqMdx } from '@/lib/mdx'
import Card from '@/components/Card'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h ISR

interface PageProps {
  params: Promise<{ citySlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params
  const supabase = supabaseStatic()
  const result = await supabase
    .from('cities')
    .select('city, state')
    .eq('slug', citySlug)
    .single()
  
  const city = result.data as { city: string; state: string } | null
  
  if (!city) return {}
  
  const title = `Pottery Classes in ${city.city}, ${city.state} | Find Classes Near You`
  const description = `Discover pottery classes in ${city.city}, ${city.state}. Compare studios, schedules, and reviews to find the perfect ceramic workshop or clay class near you.`
  
  return {
    title,
    description,
    alternates: { canonical: `/pottery-classes/${citySlug}` },
    openGraph: { 
      title, 
      description,
      type: 'website',
    }
  }
}

export default async function CityPage({ params }: PageProps) {
  const { citySlug } = await params
  const supabase = supabaseStatic()

  // Fetch city data
  const cityResult = await supabase
    .from('cities')
    .select('slug, city, state, lat, lng')
    .eq('slug', citySlug)
    .single()

  const city = cityResult.data as { slug: string; city: string; state: string; lat: number | null; lng: number | null } | null

  if (!city) return notFound()

  // Fetch providers for this city
  const providersResult = await supabase
    .from('providers')
    .select('*')
    .eq('city_slug', city.slug)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(200)
  
  const providers = providersResult.data as Array<{
    id: string;
    name: string;
    provider_slug: string;
    full_address: string;
    phone?: string;
    rating?: number;
    review_count?: number;
    website?: string;
  }> | null

  // Get MDX content
  const intro = await readCityIntroMdx(city.slug)
  const faq = await readCityFaqMdx(city.slug)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-10 bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="text-sm mb-4">
            <Link href="/pottery-classes" className="text-teal hover:text-clay">
              Pottery Classes
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">{city.city}, {city.state}</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">
            Pottery Classes in {city.city}, {city.state}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            {intro}
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            {providers?.length || 0} Pottery Studios & Classes in {city.city}
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {providers?.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-ink mb-2">
                  <Link 
                    className="text-teal hover:text-clay transition-colors" 
                    href={`/pottery-classes/${city.slug}/${provider.provider_slug}`}
                  >
                    {provider.name}
                  </Link>
                </h3>
                
                <address className="text-sm text-ink/70 not-italic mb-2">
                  {provider.full_address}
                </address>
                
                {provider.phone && (
                  <p className="text-sm text-ink/80 mb-2">
                    📞 {provider.phone}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-ink/60">
                  {typeof provider.rating === 'number' && provider.rating > 0 && (
                    <span>⭐ {provider.rating.toFixed(1)}</span>
                  )}
                  {typeof provider.review_count === 'number' && provider.review_count > 0 && (
                    <span>{provider.review_count} reviews</span>
                  )}
                </div>
                
                {provider.website && (
                  <a 
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-teal hover:text-clay transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </Card>
            ))}
          </div>
          
          {(!providers || providers.length === 0) && (
            <Card className="text-center py-8">
              <p className="text-ink/70">
                No pottery classes found in {city.city} yet. Check back soon as we&apos;re constantly 
                updating our directory!
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-white border-t border-sand">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Frequently Asked Questions About Pottery Classes in {city.city}
          </h2>
          <div className="prose prose-slate max-w-none">
            {faq}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      <section className="py-10 bg-gradient-to-b from-white to-porcelain">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-semibold text-ink mb-4">
            Explore Pottery Classes in Nearby Cities
          </h2>
          <p className="text-ink/70">
            Looking for more options? Check out pottery classes in other cities across {city.state}.
          </p>
          <div className="mt-4">
            <Link 
              href={`/pottery-classes/state/${city.state.toLowerCase()}`}
              className="text-teal hover:text-clay transition-colors"
            >
              View all cities in {city.state} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// Generate static params for popular cities
export async function generateStaticParams() {
  const supabase = supabaseStatic()
  const { data } = await supabase
    .from('cities')
    .select('slug')
    .in('slug', [
      'miami', 'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx',
      'phoenix-az', 'philadelphia-pa', 'san-antonio-tx', 'san-diego-ca', 'dallas-tx'
    ])
  
  const cities = data as Array<{ slug: string }> | null
  
  return (cities ?? []).map(c => ({ citySlug: c.slug }))
}