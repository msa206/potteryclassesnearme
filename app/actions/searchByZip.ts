'use server'

import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/db'

export async function searchByZipAction(formData: FormData) {
  const zip = formData.get('zip') as string
  const radius = formData.get('radius') as string

  // Validate ZIP code
  if (!zip || !/^\d{5}$/.test(zip.trim())) {
    redirect('/?error=invalid-zip')
  }

  const trimmedZip = zip.trim()
  // const radiusNum = Number(radius) || 50 // TODO: implement radius search

  try {
    const sb = await supabaseServer()
    
    // Search for providers with matching ZIP codes
    // Since we don't have PostGIS for distance calculation, we'll just search by exact ZIP match
    const { data: providers, error } = await sb
      .from('providers_raw')
      .select('id, name, city, state, street, postal_code, phone_number, review_stars, review_count')
      .eq('postal_code', trimmedZip)
      .limit(100)

    if (error) {
      console.error('Database error:', error)
      redirect('/?error=search-failed')
    }

    // If we found results, redirect to a search results page
    if (providers && providers.length > 0) {
      const searchParams = new URLSearchParams({
        zip: trimmedZip,
        radius: radius || '50'
      })
      redirect(`/search?${searchParams.toString()}`)
    } else {
      // No results found
      redirect(`/?error=no-results&zip=${trimmedZip}&radius=${radius || '50'}`)
    }
  } catch (error) {
    console.error('Search error:', error)
    redirect('/?error=search-failed')
  }
}