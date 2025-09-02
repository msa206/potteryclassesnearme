import { supabaseStatic } from "./db";
import { slugify, getStateSlug } from "./slugify";

// Optimized query for just getting provider counts by city/state
export async function getCityProviderCounts() {
  const sb = supabaseStatic();
  
  const { data: providers, error } = await sb
    .from("providers_raw")
    .select("city, state")
    .limit(2000); // Reasonable limit for counting
  
  if (error) {
    console.error('Database error in getCityProviderCounts:', error);
    return new Map();
  }

  const cityCountsMap = new Map();
  providers?.forEach((p: any) => {
    if (p.city && p.state) {
      const citySlug = slugify(p.city);
      const stateSlug = getStateSlug(p.state);
      const cityKey = `${citySlug}-${stateSlug}`;
      
      if (!cityCountsMap.has(cityKey)) {
        cityCountsMap.set(cityKey, {
          city: p.city,
          state: p.state,
          city_slug: citySlug,
          state_slug: stateSlug,
          provider_count: 1
        });
      } else {
        const cityData = cityCountsMap.get(cityKey);
        cityData.provider_count++;
      }
    }
  });
  
  return cityCountsMap;
}

// Optimized query for getting state provider counts
export async function getStateProviderCounts() {
  const sb = supabaseStatic();
  
  const { data: providers, error } = await sb
    .from("providers_raw")
    .select("state")
    .limit(2000);
  
  if (error) {
    console.error('Database error in getStateProviderCounts:', error);
    return new Map();
  }

  const stateCountsMap = new Map();
  providers?.forEach((p: any) => {
    if (p.state) {
      const stateSlug = getStateSlug(p.state);
      if (!stateCountsMap.has(stateSlug)) {
        stateCountsMap.set(stateSlug, {
          state: p.state,
          state_slug: stateSlug,
          provider_count: 1
        });
      } else {
        const stateData = stateCountsMap.get(stateSlug);
        stateData.provider_count++;
      }
    }
  });
  
  return stateCountsMap;
}

export async function getCity(stateSlug: string, citySlug: string) {
  const sb = supabaseStatic();
  
  // Get minimal provider data to find matching city
  const { data: providers } = await sb
    .from("providers_raw")
    .select("city, state")
    .limit(1000); // Limit to avoid large queries
  
  // Find the city that matches our slugs
  const matchingCity = providers?.find((p: any) => {
    return slugify(p.city) === citySlug && getStateSlug(p.state) === stateSlug;
  });
  
  if (!matchingCity) return null;
  
  // Return city info in expected format
  return {
    slug: citySlug,
    city: (matchingCity as any).city,
    state: (matchingCity as any).state,
    city_slug: citySlug,
    state_slug: stateSlug
  };
}

export async function listProvidersForCity(citySlug: string, stateSlug?: string, limit = 200, offset = 0) {
  const sb = supabaseStatic();
  
  // Select only the columns needed for listing pages
  const { data: allProviders, error } = await sb
    .from("providers_raw")
    .select("id, name, city, state, street, postal_code, phone_number, review_stars, review_count, working_hours")
    .order("review_count", { ascending: false, nullsFirst: false });
  
  if (error) throw error;
  
  // Filter by city slug (and optionally state slug)
  const filteredProviders = allProviders?.filter((p: any) => {
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
  const matchingProvider = providers?.find((p: any) => {
    const pCitySlug = slugify(p.city);
    const pStateSlug = getStateSlug(p.state);
    const pProviderSlug = slugify(p.name);
    
    return pStateSlug === stateSlug && pCitySlug === citySlug && pProviderSlug === providerSlug;
  });
  
  if (!matchingProvider) return null;
  
  // Add generated slugs to the provider data
  return {
    ...(matchingProvider as any),
    provider_slug: slugify((matchingProvider as any).name),
    city_slug: slugify((matchingProvider as any).city),
    state_slug: getStateSlug((matchingProvider as any).state),
    // Map column names to expected names
    rating: (matchingProvider as any).review_stars,
    review_count: (matchingProvider as any).review_count,
    street: (matchingProvider as any).street,
    city: (matchingProvider as any).city,
    state: (matchingProvider as any).state,
    zip: (matchingProvider as any).postal_code,
    phone: (matchingProvider as any).phone_number,
    website: (matchingProvider as any).site,
    lat: (matchingProvider as any).latitude,
    lng: (matchingProvider as any).longitude,
    working_hours: (matchingProvider as any).working_hours
  };
}