import { MetadataRoute } from 'next'
import { supabaseStatic } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = supabaseStatic()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://potteryclasses.com'
  
  // Get all cities
  const citiesResult = await supabase
    .from('cities')
    .select('slug, city, state')
    .order('slug')
  
  const cities = citiesResult.data as Array<{ slug: string; city: string; state: string }> | null
  
  // Get all providers  
  const providersResult = await supabase
    .from('providers')
    .select('provider_slug, city_slug, updated_at')
    .order('provider_slug')
    .limit(5000) // Limit for sitemap size
  
  const providers = providersResult.data as Array<{ 
    provider_slug: string; 
    city_slug: string; 
    updated_at: string | null 
  }> | null
  
  // Get all states
  const statesResult = await supabase
    .from('cities')
    .select('state_slug')
  
  const states = statesResult.data as Array<{ state_slug: string }> | null
  
  const uniqueStates = states ? Array.from(new Set(states.map(s => s.state_slug))) : []
  
  const urls: MetadataRoute.Sitemap = []
  
  // Main pottery classes hub
  urls.push({
    url: `${baseUrl}/pottery-classes`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })
  
  // City pages
  cities?.forEach(city => {
    urls.push({
      url: `${baseUrl}/pottery-classes/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })
  
  // State pages
  uniqueStates.forEach(stateSlug => {
    urls.push({
      url: `${baseUrl}/pottery-classes/state/${stateSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })
  
  // Provider pages (limit to prevent huge sitemaps)
  providers?.slice(0, 2000).forEach(provider => {
    urls.push({
      url: `${baseUrl}/pottery-classes/${provider.city_slug}/${provider.provider_slug}`,
      lastModified: provider.updated_at ? new Date(provider.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })
  
  return urls
}