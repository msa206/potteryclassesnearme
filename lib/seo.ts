import type { ReadonlyURLSearchParams } from 'next/navigation'

// Types for SEO functions
interface BuildTitleParams {
  type?: 'city' | 'state' | 'studio' | 'home'
  city?: string
  state?: string
  page?: number
  studioName?: string
}

interface BuildDescriptionParams {
  type?: 'city' | 'state' | 'studio' | 'home'
  city?: string
  state?: string
  count?: number
  studioName?: string
}

interface CanonicalParams {
  pathname: string
  searchParams?: ReadonlyURLSearchParams | URLSearchParams | null
}

// Title builders
export function buildTitle({ type, city, state, page, studioName }: BuildTitleParams): string {
  let title = ''
  
  switch (type) {
    case 'city':
      title = `Pottery Classes in ${city}, ${state}`
      if (page && page > 1) title += ` - Page ${page}`
      break
    case 'state':
      title = `Pottery Classes in ${state} | Local Pottery Studios`
      break
    case 'studio':
      title = `Pottery Classes at ${studioName}`
      break
    case 'home':
    default:
      title = 'Pottery Classes Near You | Local Pottery Classes Directory'
      break
  }
  
  return title
}

// Description builders
export function buildDescription({ type, city, state, count, studioName }: BuildDescriptionParams): string {
  let description = ''
  
  switch (type) {
    case 'city':
      const studioText = count === 1 ? 'studio' : 'studios'
      description = `Discover ${count || ''} pottery ${studioText} and ceramic workshops in ${city}, ${state}. Find wheel throwing, hand-building, and glazing classes for all skill levels.`
      break
    case 'state':
      description = `Browse pottery studios and ceramic workshops across ${state}. Find wheel throwing, hand-building, and glazing classes in cities throughout the state.`
      break
    case 'studio':
      description = `${studioName} offers pottery classes in ${city}, ${state}. Learn wheel throwing, hand-building, and ceramic techniques from experienced instructors.`
      break
    case 'home':
    default:
      description = 'Discover pottery classes, ceramic workshops, and clay studios across the United States. Find wheel throwing, hand-building, and glazing classes near you.'
      break
  }
  
  return description
}

// Canonical URL builder
export function canonicalFor({ pathname, searchParams }: CanonicalParams): string {
  const baseUrl = 'https://localpotteryclasses.com'
  let url = baseUrl + pathname
  
  // Only include certain search params in canonical URL
  if (searchParams) {
    const allowedParams = ['page']
    const params = new URLSearchParams()
    
    for (const param of allowedParams) {
      const value = searchParams.get(param)
      if (value && value !== '1') { // Don't include page=1 in canonical
        params.set(param, value)
      }
    }
    
    const paramString = params.toString()
    if (paramString) {
      url += '?' + paramString
    }
  }
  
  // Only add trailing slash for root domain
  if (pathname === '' && !url.endsWith('/')) {
    url += '/'
  }
  
  return url
}

// JSON-LD Schema generators
export const jsonLd = {
  // ItemList for listing pages
  ItemList: (items: Array<{ name: string; url: string; description?: string }>, listName: string, description?: string) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: description || `List of ${listName.toLowerCase()}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: item.url,
        description: item.description || `${item.name} pottery classes and ceramic workshops`
      }
    }))
  }),

  // LocalBusiness for studio detail pages
  LocalBusiness: (studio: {
    name: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
    }
    phone?: string
    website?: string
    geo?: {
      latitude?: number
      longitude?: number
    }
    rating?: number
    reviewCount?: number
    hours?: string
  }) => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': studio.website || undefined,
      name: studio.name,
      description: `${studio.name} offers pottery classes and ceramic workshops. Learn wheel throwing, hand-building, and glazing techniques.`,
      url: studio.website,
      telephone: studio.phone,
      priceRange: '$$',
      category: 'Art School'
    }

    // Add address if available
    if (studio.address) {
      schema.address = {
        '@type': 'PostalAddress',
        streetAddress: studio.address.street,
        addressLocality: studio.address.city,
        addressRegion: studio.address.state,
        postalCode: studio.address.zip,
        addressCountry: 'US'
      }
    }

    // Add geo coordinates if available
    if (studio.geo?.latitude && studio.geo?.longitude) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: studio.geo.latitude,
        longitude: studio.geo.longitude
      }
    }

    // Add rating if available
    if (studio.rating && studio.reviewCount) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: studio.rating,
        reviewCount: studio.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    }

    // Add opening hours if available
    if (studio.hours) {
      // This would need to be parsed from the working_hours format
      // For now, we'll skip it as it requires complex parsing
    }

    return schema
  },

  // BreadcrumbList for navigation
  BreadcrumbList: (breadcrumbs: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }),

  // Organization for website identity
  Organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pottery Classes Near Me',
    description: 'Find pottery classes, ceramic workshops, and clay studios across the United States',
    url: 'https://localpotteryclasses.com',
    logo: 'https://localpotteryclasses.com/logo.png',
    sameAs: []
  }),

  // WebSite for search functionality
  WebSite: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pottery Classes Near Me',
    url: 'https://localpotteryclasses.com',
    description: 'Find pottery classes, ceramic workshops, and clay studios across the United States',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://localpotteryclasses.com/search?location={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  })
}

// Helper to generate meta tags
export function generateMetaTags({
  title,
  description,
  canonical,
  noindex = false,
  ogImage,
}: {
  title: string
  description: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
}) {
  const meta: any = {
    title,
    description,
    robots: noindex ? 'noindex, follow' : 'index, follow',
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Pottery Classes Near Me',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  }

  if (canonical) {
    meta.alternates = { canonical }
  }

  if (ogImage) {
    meta.openGraph.images = [{ url: ogImage }]
    meta.twitter.images = [ogImage]
  }

  return meta
}

// Helper to format page titles with site name
export function formatPageTitle(title: string): string {
  if (title.includes('Pottery Classes Near Me') || title.includes('Nationwide Directory')) {
    return title
  }
  return `${title} | Pottery Classes Near Me`
}