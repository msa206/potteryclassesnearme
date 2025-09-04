import { MetadataRoute } from 'next'
import { getCityProviderCounts, getStateProviderCounts } from '@/lib/queries'
import { supabaseStatic } from '@/lib/db'
import { slugify, getStateSlug } from '@/lib/slugify'

// Default last modified date for pages without specific dates
const DEFAULT_LAST_MODIFIED = new Date('2025-09-03')

// Page-specific last modified dates
// Add entries here when you edit specific pages
// Format: 'path' -> new Date('YYYY-MM-DD')
const PAGE_SPECIFIC_DATES: Record<string, Date> = {
  // Static pages
  // '/': new Date('2025-09-04'),
  // '/pottery-classes': new Date('2025-09-04'),
  // '/all-cities': new Date('2025-09-04'),
  
  // State pages - use state slug
  // 'california': new Date('2025-09-04'),
  // 'new-york': new Date('2025-09-04'),
  
  // City pages - use "state-slug/city-slug"
  // 'california/los-angeles': new Date('2025-09-04'),
  // 'new-york/new-york-city': new Date('2025-09-04'),
  
  // Studio pages - use "state-slug/city-slug/studio-slug"
  'florida/dunedin/muddy-potter-art-clay-studio': new Date('2025-09-04'),
  // 'california/los-angeles/clay-studio-2': new Date('2025-09-04'),
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use localhost for development, production URL for production
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://localpotteryclasses.com'
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // Static pages
  sitemap.push(
    {
      url: baseUrl,
      lastModified: PAGE_SPECIFIC_DATES['/'] || DEFAULT_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pottery-classes`,
      lastModified: PAGE_SPECIFIC_DATES['/pottery-classes'] || DEFAULT_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/all-cities`,
      lastModified: PAGE_SPECIFIC_DATES['/all-cities'] || DEFAULT_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  )

  try {
    // Get all state pages
    const stateCountsMap = await getStateProviderCounts()
    
    for (const [stateSlug, stateData] of stateCountsMap) {
      sitemap.push({
        url: `${baseUrl}/pottery-classes/${stateSlug}`,
        lastModified: PAGE_SPECIFIC_DATES[stateSlug] || DEFAULT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Get all city pages
    const cityCountsMap = await getCityProviderCounts()
    
    for (const [cityKey, cityData] of cityCountsMap) {
      const { city_slug, state_slug } = cityData as any
      const cityDateKey = `${state_slug}/${city_slug}`
      sitemap.push({
        url: `${baseUrl}/pottery-classes/${state_slug}/${city_slug}`,
        lastModified: PAGE_SPECIFIC_DATES[cityDateKey] || DEFAULT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    // Get all studio detail pages
    const sb = supabaseStatic()
    const { data: providers, error } = await sb
      .from("providers_raw")
      .select("name, city, state")
      .limit(5000) // Limit to prevent timeout
    
    if (!error && providers) {
      for (const provider of providers) {
        if ((provider as any).name && (provider as any).city && (provider as any).state) {
          const providerSlug = slugify((provider as any).name)
          const citySlug = slugify((provider as any).city)
          const stateSlug = getStateSlug((provider as any).state)
          const studioDateKey = `${stateSlug}/${citySlug}/${providerSlug}`
          
          sitemap.push({
            url: `${baseUrl}/pottery-classes/${stateSlug}/${citySlug}/${providerSlug}`,
            lastModified: PAGE_SPECIFIC_DATES[studioDateKey] || DEFAULT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }
    }

    // Add ZIP code search pages (if you have them)
    // You can uncomment this if you want to include ZIP pages
    /*
    const zipCodes = ['90210', '10001', '60601', '77001', '30301'] // Example ZIPs
    for (const zip of zipCodes) {
      sitemap.push({
        url: `${baseUrl}/pottery-classes/zip/${zip}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
    */
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return basic sitemap if database queries fail
  }
  
  return sitemap
}