import { supabaseStatic } from "./db";
import { slugify, getStateSlug } from "./slugify";

export async function getCity(stateSlug: string, citySlug: string) {
  const sb = supabaseStatic();
  
  // Get all providers and find matching city
  const { data: providers } = await sb
    .from("providers_raw")
    .select("city, state");
  
  // Find the city that matches our slugs
  const matchingCity = providers?.find(p => {
    return slugify(p.city) === citySlug && getStateSlug(p.state) === stateSlug;
  });
  
  if (!matchingCity) return null;
  
  // Return city info in expected format
  return {
    slug: citySlug,
    city: matchingCity.city,
    state: matchingCity.state,
    city_slug: citySlug,
    state_slug: stateSlug
  };
}

export async function listProvidersForCity(citySlug: string, stateSlug?: string, limit = 200, offset = 0) {
  const sb = supabaseStatic();
  
  // Get all providers
  const { data: allProviders, error } = await sb
    .from("providers_raw")
    .select("*")
    .order("review_count", { ascending: false, nullsFirst: false });
  
  if (error) throw error;
  
  // Filter by city slug (and optionally state slug)
  const filteredProviders = allProviders?.filter(p => {
    const pCitySlug = slugify(p.city);
    const pStateSlug = getStateSlug(p.state);
    
    if (stateSlug) {
      return pCitySlug === citySlug && pStateSlug === stateSlug;
    }
    return pCitySlug === citySlug;
  }) || [];
  
  // Apply pagination
  return filteredProviders.slice(offset, offset + limit);
}

export async function getProviderBySlugs(stateSlug: string, citySlug: string, providerSlug: string) {
  const sb = supabaseStatic();
  
  // Get all providers
  const { data: providers, error } = await sb
    .from("providers_raw")
    .select("*");
  
  if (error) return null;
  
  // Find the matching provider
  const matchingProvider = providers?.find(p => {
    const pCitySlug = slugify(p.city);
    const pStateSlug = getStateSlug(p.state);
    const pProviderSlug = slugify(p.name);
    
    return pStateSlug === stateSlug && pCitySlug === citySlug && pProviderSlug === providerSlug;
  });
  
  if (!matchingProvider) return null;
  
  // Add generated slugs to the provider data
  return {
    ...matchingProvider,
    provider_slug: slugify(matchingProvider.name),
    city_slug: slugify(matchingProvider.city),
    state_slug: getStateSlug(matchingProvider.state),
    // Map column names to expected names
    rating: matchingProvider.review_stars,
    review_count: matchingProvider.review_count,
    street: matchingProvider.street,
    city: matchingProvider.city,
    state: matchingProvider.state,
    zip: matchingProvider.postal_code,
    phone: matchingProvider.phone_number,
    website: matchingProvider.site,
    lat: matchingProvider.latitude,
    lng: matchingProvider.longitude,
    working_hours: matchingProvider.working_hours
  };
}