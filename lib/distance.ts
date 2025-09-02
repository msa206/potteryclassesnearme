/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter and sort providers by distance from a center point
 * @param providers Array of providers with lat/lng
 * @param centerLat Center point latitude
 * @param centerLng Center point longitude
 * @param radiusMiles Maximum radius in miles
 * @returns Filtered and sorted array with distance added
 */
export function filterByDistance<T extends { latitude: number | null; longitude: number | null }>(
  providers: T[],
  centerLat: number,
  centerLng: number,
  radiusMiles: number
): (T & { distance_miles: number })[] {
  const results: (T & { distance_miles: number })[] = [];
  
  for (const provider of providers) {
    if (provider.latitude == null || provider.longitude == null) {
      continue; // Skip providers without coordinates
    }
    
    const distance = calculateDistance(
      centerLat,
      centerLng,
      provider.latitude,
      provider.longitude
    );
    
    if (distance <= radiusMiles) {
      results.push({
        ...provider,
        distance_miles: distance
      });
    }
  }
  
  // Sort by distance
  return results.sort((a, b) => a.distance_miles - b.distance_miles);
}