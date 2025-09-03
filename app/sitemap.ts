import { MetadataRoute } from 'next'
import { getCityProviderCounts, getStateProviderCounts } from '@/lib/queries'
import { supabaseStatic } from '@/lib/db'
import { slugify, getStateSlug } from '@/lib/slugify'

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
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pottery-classes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/all-cities`,
      lastModified: new Date(),
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
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Get all city pages
    const cityCountsMap = await getCityProviderCounts()
    
    for (const [cityKey, cityData] of cityCountsMap) {
      const { city_slug, state_slug } = cityData as any
      sitemap.push({
        url: `${baseUrl}/pottery-classes/${state_slug}/${city_slug}`,
        lastModified: new Date(),
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
          
          sitemap.push({
            url: `${baseUrl}/pottery-classes/${stateSlug}/${citySlug}/${providerSlug}`,
            lastModified: new Date(),
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