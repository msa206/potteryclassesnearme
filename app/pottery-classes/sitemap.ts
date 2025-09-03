import { MetadataRoute } from 'next'
import { supabaseStatic } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = supabaseStatic()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localpotteryclasses.com'
  
  // Get all providers from providers_raw
  const providersResult = await supabase
    .from('providers_raw')
    .select('provider_slug, city_slug, state_slug, city, state, updated_at')
    .order('provider_slug')
    .limit(5000) // Limit for sitemap size
  
  const providers = providersResult.data as Array<{ 
    provider_slug: string; 
    city_slug: string;
    state_slug: string;
    city: string;
    state: string;
    updated_at: string | null 
  }> | null
  
  // Extract unique cities and states from providers
  const citiesMap = new Map()
  const statesSet = new Set<string>()
  
  providers?.forEach(p => {
    if (p.city_slug && p.state_slug) {
      if (!citiesMap.has(p.city_slug)) {
        citiesMap.set(p.city_slug, {
          slug: p.city_slug,
          city: p.city,
          state: p.state,
          state_slug: p.state_slug
        })
      }
      statesSet.add(p.state_slug)
    }
  })
  
  const cities = Array.from(citiesMap.values())
  const uniqueStates = Array.from(statesSet)
  
  const urls: MetadataRoute.Sitemap = []
  
  // Main pottery classes hub
  urls.push({
    url: `${baseUrl}/pottery-classes`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })
  
  // City pages
  cities.forEach(city => {
    urls.push({
      url: `${baseUrl}/pottery-classes/${city.state_slug}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })
  
  // State pages
  uniqueStates.forEach(stateSlug => {
    urls.push({
      url: `${baseUrl}/pottery-classes/${stateSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })
  
  // Provider pages (limit to prevent huge sitemaps)
  providers?.slice(0, 2000).forEach(provider => {
    urls.push({
      url: `${baseUrl}/pottery-classes/${provider.state_slug}/${provider.city_slug}/${provider.provider_slug}`,
      lastModified: provider.updated_at ? new Date(provider.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })
  
  return urls
}