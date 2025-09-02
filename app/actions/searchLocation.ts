'use server';

import { redirect } from 'next/navigation';

export async function searchLocationAction(formData: FormData) {
  const location = formData.get('location') as string;
  const trimmedLocation = (location || '').trim();
  
  if (!trimmedLocation) {
    redirect('/pottery-classes?error=empty-location');
  }

  // Check if it's a ZIP code (5 digits)
  if (/^\d{5}$/.test(trimmedLocation)) {
    // For ZIP codes, redirect to the ZIP-specific route
    redirect(`/pottery-classes/zip/${trimmedLocation}?radius=50`);
  } else {
    // For city/state searches, use the existing search functionality
    redirect(`/search?location=${encodeURIComponent(trimmedLocation)}`);
  }
}