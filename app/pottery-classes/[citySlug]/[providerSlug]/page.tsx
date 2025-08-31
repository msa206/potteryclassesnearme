import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'
import Card from '@/components/Card'
import Button from '@/components/Button'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h ISR

interface PageProps {
  params: Promise<{ 
    citySlug: string
    providerSlug: string 
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { providerSlug } = await params
  const supabase = supabaseStatic()
  
  const { data, error } = await supabase
    .from('providers')
    .select('name, city, state')
    .eq('provider_slug', providerSlug)
    .single()
  
  if (error) {
    console.error('Error fetching provider:', error)
  }
  
  const provider = data as { name: string; city: string; state: string } | null
  
  if (provider) {
    return {
      title: `${provider.name} - Pottery Classes in ${provider.city}, ${provider.state}`,
      description: `Learn pottery at ${provider.name} in ${provider.city}, ${provider.state}. View class schedules, reviews, and contact information.`,
      openGraph: { 
        title: `${provider.name} - Pottery Classes in ${provider.city}, ${provider.state}`,
        description: `Learn pottery at ${provider.name} in ${provider.city}, ${provider.state}. View class schedules, reviews, and contact information.`,
        type: 'website',
      }
    }
  }
  
  return {
    title: 'Pottery Class Provider',
    description: 'Find pottery classes and ceramic workshops',
  }
}

export default async function ProviderPage({ params }: PageProps) {
  const { citySlug, providerSlug } = await params
  const supabase = supabaseStatic()

  // Fetch provider data
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('provider_slug', providerSlug)
    .single()

  if (error || !data) {
    return notFound()
  }
  
  // Type assertion after null check
  const provider = data as {
    id: string;
    name: string;
    provider_slug: string;
    city_slug: string;
    city: string;
    state: string;
    full_address: string;
    phone?: string;
    website?: string;
    rating?: number;
    review_count?: number;
    working_hours?: string;
    lat?: number;
    lng?: number;
  }
  
  if (provider.city_slug !== citySlug) {
    return notFound()
  }

  // Fetch city data for breadcrumb
  const cityResult = await supabase
    .from('cities')
    .select('slug, city, state')
    .eq('slug', citySlug)
    .single()
  
  const city = cityResult.data as { slug: string; city: string; state: string } | null

  // Fetch other providers in the same city
  const otherProvidersResult = await supabase
    .from('providers')
    .select('provider_slug, name, rating')
    .eq('city_slug', citySlug)
    .neq('id', provider.id)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(5)
  
  const otherProviders = otherProvidersResult.data as Array<{
    provider_slug: string;
    name: string;
    rating: number | null;
  }> | null

  return (
    <main className="min-h-screen">
      {/* Breadcrumb & Header */}
      <section className="py-8 bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="text-sm mb-4">
            <Link href="/pottery-classes" className="text-teal hover:text-clay">
              Pottery Classes
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <Link href={`/pottery-classes/${citySlug}`} className="text-teal hover:text-clay">
              {city?.city}, {city?.state}
            </Link>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">{provider.name}</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
            {provider.name}
          </h1>
          
          <div className="flex items-center gap-4 text-ink/70">
            {typeof provider.rating === 'number' && provider.rating > 0 && (
              <span className="text-lg">⭐ {provider.rating.toFixed(1)}</span>
            )}
            {typeof provider.review_count === 'number' && provider.review_count > 0 && (
              <span>{provider.review_count} reviews</span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <h2 className="text-xl font-semibold text-ink mb-4">About This Studio</h2>
                <p className="text-ink/80">
                  {provider.name} offers pottery classes and ceramic workshops in {provider.city}, {provider.state}. 
                  Whether you&apos;re interested in wheel throwing, hand-building, or glazing techniques, 
                  this studio provides a creative space to explore the art of pottery.
                </p>
              </Card>

              {provider.working_hours && (
                <Card>
                  <h2 className="text-xl font-semibold text-ink mb-4">Hours</h2>
                  <p className="text-ink/80 whitespace-pre-line">{provider.working_hours}</p>
                </Card>
              )}

              <Card>
                <h2 className="text-xl font-semibold text-ink mb-4">What to Expect</h2>
                <ul className="space-y-2 text-ink/80">
                  <li>• Professional instruction for all skill levels</li>
                  <li>• Access to pottery wheels and hand-building tools</li>
                  <li>• Clay and basic glazes included in most classes</li>
                  <li>• Kiln firing services available</li>
                  <li>• Friendly, supportive learning environment</li>
                </ul>
              </Card>
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-ink mb-3">Contact Information</h3>
                
                <address className="not-italic space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-ink mb-1">Address</p>
                    <p className="text-ink/70">{provider.full_address}</p>
                  </div>
                  
                  {provider.phone && (
                    <div>
                      <p className="font-medium text-ink mb-1">Phone</p>
                      <p className="text-ink/70">{provider.phone}</p>
                    </div>
                  )}
                  
                  {provider.website && (
                    <div>
                      <p className="font-medium text-ink mb-1">Website</p>
                      <a 
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal hover:text-clay break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </address>

                {provider.lat && provider.lng && (
                  <div className="pt-3 border-t border-sand">
                    <Button 
                      href={`https://www.google.com/maps/search/?api=1&query=${provider.lat},${provider.lng}`}
                      variant="secondary"
                    >
                      Get Directions
                    </Button>
                  </div>
                )}
              </Card>

              {otherProviders && otherProviders.length > 0 && (
                <Card>
                  <h3 className="font-semibold text-ink mb-3">
                    Other Studios in {city?.city}
                  </h3>
                  <ul className="space-y-2">
                    {otherProviders.map((other) => (
                      <li key={other.provider_slug}>
                        <Link 
                          href={`/pottery-classes/${citySlug}/${other.provider_slug}`}
                          className="text-sm text-teal hover:text-clay"
                        >
                          {other.name}
                          {other.rating && (
                            <span className="text-ink/60 ml-2">
                              ({other.rating.toFixed(1)})
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-sand">
                    <Link 
                      href={`/pottery-classes/${citySlug}`}
                      className="text-sm text-teal hover:text-clay"
                    >
                      View all studios →
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white border-t border-sand">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-ink mb-2">Do I need to bring my own materials?</h3>
              <p className="text-ink/70 text-sm">
                Most pottery studios provide clay, tools, and glazes as part of the class fee. 
                Check with {provider.name} about what&apos;s included in their classes.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-ink mb-2">How long are typical classes?</h3>
              <p className="text-ink/70 text-sm">
                Pottery classes usually run 2-3 hours for single sessions, or 6-8 weeks for 
                comprehensive courses. Contact the studio for their specific class schedules.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-ink mb-2">Can I take my pottery home?</h3>
              <p className="text-ink/70 text-sm">
                Yes! After your pieces are fired and glazed (usually 2-3 weeks after creation), 
                you can take them home. Some studios offer shipping for larger pieces.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-ink mb-2">Are classes suitable for beginners?</h3>
              <p className="text-ink/70 text-sm">
                Most studios offer beginner-friendly classes. {provider.name} likely has options 
                for all skill levels - contact them to find the right class for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Generate static params for a subset of providers
export async function generateStaticParams() {
  const supabase = supabaseStatic()
  
  // Get top-rated providers from major cities
  const { data } = await supabase
    .from('providers')
    .select('provider_slug, city_slug')
    .order('rating', { ascending: false })
    .limit(100)
  
  const providers = data as Array<{ provider_slug: string; city_slug: string }> | null
  
  return (providers ?? []).map(p => ({ 
    citySlug: p.city_slug,
    providerSlug: p.provider_slug 
  }))
}