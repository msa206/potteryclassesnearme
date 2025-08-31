import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { supabaseStatic } from '@/lib/db'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h ISR

interface PageProps {
  params: Promise<{ zip: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params
  
  const title = `Pottery Classes in ${zip} | Find Classes Near You`
  const description = `Find pottery classes, ceramic workshops, and clay studios in the ${zip} ZIP code area.`
  
  return {
    title,
    description,
    robots: 'noindex, follow', // ZIP pages are for redirect, not for indexing
  }
}

export default async function ZipPage({ params }: PageProps) {
  const { zip } = await params
  const supabase = supabaseStatic()

  // Look up city for this ZIP code
  const zipResult = await supabase
    .from('zip_mappings')
    .select('city_slug')
    .eq('zip', zip)
    .single()

  const zipMapping = zipResult.data as { city_slug: string } | null

  if (zipMapping?.city_slug) {
    // Redirect to the city page
    redirect(`/pottery-classes/${zipMapping.city_slug}`)
  }

  // If no mapping found, try to find providers directly
  const providersResult = await supabase
    .from('providers')
    .select('city_slug')
    .eq('zip', zip)
    .limit(1)

  const providers = providersResult.data as Array<{ city_slug: string }> | null

  if (providers?.[0]?.city_slug) {
    // Redirect to the city page
    redirect(`/pottery-classes/${providers[0].city_slug}`)
  }

  // If no data found, show not found
  return notFound()
}

// Generate static params for common ZIP codes
export async function generateStaticParams() {
  // For now, return empty array - ZIP pages will be generated on-demand
  // In production, you might want to pre-generate popular ZIP codes
  return []
}