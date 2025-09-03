/**
 * Map of each state to its neighboring/nearby states
 * Based on actual geographic borders
 * Using full state name slugs instead of abbreviations
 */
export const nearbyStates: Record<string, string[]> = {
  // Northeast
  'maine': ['new-hampshire', 'massachusetts', 'vermont'],
  'new-hampshire': ['maine', 'vermont', 'massachusetts'],
  'vermont': ['new-hampshire', 'massachusetts', 'new-york'],
  'massachusetts': ['rhode-island', 'connecticut', 'new-hampshire', 'vermont', 'new-york'],
  'rhode-island': ['massachusetts', 'connecticut'],
  'connecticut': ['massachusetts', 'rhode-island', 'new-york'],
  'new-york': ['vermont', 'massachusetts', 'connecticut', 'new-jersey', 'pennsylvania'],
  'new-jersey': ['new-york', 'pennsylvania', 'delaware'],
  'pennsylvania': ['new-york', 'new-jersey', 'delaware', 'maryland', 'west-virginia', 'ohio'],
  'delaware': ['maryland', 'pennsylvania', 'new-jersey'],
  'maryland': ['pennsylvania', 'west-virginia', 'virginia', 'delaware', 'district-of-columbia'],
  'district-of-columbia': ['maryland', 'virginia'],
  
  // Southeast
  'virginia': ['maryland', 'west-virginia', 'kentucky', 'tennessee', 'north-carolina', 'district-of-columbia'],
  'west-virginia': ['pennsylvania', 'maryland', 'virginia', 'kentucky', 'ohio'],
  'north-carolina': ['virginia', 'tennessee', 'georgia', 'south-carolina'],
  'south-carolina': ['north-carolina', 'georgia'],
  'georgia': ['north-carolina', 'south-carolina', 'florida', 'alabama', 'tennessee'],
  'florida': ['georgia', 'alabama'],
  'kentucky': ['indiana', 'ohio', 'west-virginia', 'virginia', 'tennessee', 'missouri', 'illinois'],
  'tennessee': ['kentucky', 'virginia', 'north-carolina', 'georgia', 'alabama', 'mississippi', 'arkansas', 'missouri'],
  'alabama': ['tennessee', 'georgia', 'florida', 'mississippi'],
  'mississippi': ['tennessee', 'alabama', 'louisiana', 'arkansas'],
  'louisiana': ['texas', 'arkansas', 'mississippi'],
  'arkansas': ['missouri', 'tennessee', 'mississippi', 'louisiana', 'texas', 'oklahoma'],
  
  // Midwest
  'ohio': ['michigan', 'pennsylvania', 'west-virginia', 'kentucky', 'indiana'],
  'michigan': ['wisconsin', 'indiana', 'ohio'],
  'indiana': ['michigan', 'ohio', 'kentucky', 'illinois'],
  'illinois': ['wisconsin', 'indiana', 'kentucky', 'missouri', 'iowa'],
  'wisconsin': ['michigan', 'minnesota', 'iowa', 'illinois'],
  'minnesota': ['wisconsin', 'iowa', 'south-dakota', 'north-dakota'],
  'iowa': ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota'],
  'missouri': ['iowa', 'illinois', 'kentucky', 'tennessee', 'arkansas', 'oklahoma', 'kansas', 'nebraska'],
  'north-dakota': ['minnesota', 'south-dakota', 'montana'],
  'south-dakota': ['north-dakota', 'minnesota', 'iowa', 'nebraska', 'wyoming', 'montana'],
  'nebraska': ['south-dakota', 'iowa', 'missouri', 'kansas', 'colorado', 'wyoming'],
  'kansas': ['nebraska', 'missouri', 'oklahoma', 'colorado'],
  
  // Southwest
  'oklahoma': ['kansas', 'missouri', 'arkansas', 'texas', 'new-mexico', 'colorado'],
  'texas': ['new-mexico', 'oklahoma', 'arkansas', 'louisiana'],
  'new-mexico': ['colorado', 'oklahoma', 'texas', 'arizona', 'utah'],
  'arizona': ['california', 'nevada', 'utah', 'new-mexico'],
  'colorado': ['wyoming', 'nebraska', 'kansas', 'oklahoma', 'new-mexico', 'utah'],
  'utah': ['idaho', 'wyoming', 'colorado', 'arizona', 'nevada'],
  'nevada': ['idaho', 'utah', 'arizona', 'california', 'oregon'],
  
  // West
  'california': ['oregon', 'nevada', 'arizona'],
  'oregon': ['washington', 'idaho', 'nevada', 'california'],
  'washington': ['idaho', 'oregon'],
  'idaho': ['montana', 'wyoming', 'utah', 'nevada', 'oregon', 'washington'],
  'montana': ['north-dakota', 'south-dakota', 'wyoming', 'idaho'],
  'wyoming': ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho'],
  
  // Non-contiguous
  'alaska': [], // Alaska has no bordering states
  'hawaii': []  // Hawaii has no bordering states
};

/**
 * Get the display name for a state from its slug
 */
export const stateDisplayNames: Record<string, string> = {
  'alabama': 'Alabama', 'alaska': 'Alaska', 'arizona': 'Arizona', 'arkansas': 'Arkansas',
  'california': 'California', 'colorado': 'Colorado', 'connecticut': 'Connecticut', 'delaware': 'Delaware',
  'florida': 'Florida', 'georgia': 'Georgia', 'hawaii': 'Hawaii', 'idaho': 'Idaho',
  'illinois': 'Illinois', 'indiana': 'Indiana', 'iowa': 'Iowa', 'kansas': 'Kansas',
  'kentucky': 'Kentucky', 'louisiana': 'Louisiana', 'maine': 'Maine', 'maryland': 'Maryland',
  'massachusetts': 'Massachusetts', 'michigan': 'Michigan', 'minnesota': 'Minnesota', 'mississippi': 'Mississippi',
  'missouri': 'Missouri', 'montana': 'Montana', 'nebraska': 'Nebraska', 'nevada': 'Nevada',
  'new-hampshire': 'New Hampshire', 'new-jersey': 'New Jersey', 'new-mexico': 'New Mexico', 'new-york': 'New York',
  'north-carolina': 'North Carolina', 'north-dakota': 'North Dakota', 'ohio': 'Ohio', 'oklahoma': 'Oklahoma',
  'oregon': 'Oregon', 'pennsylvania': 'Pennsylvania', 'rhode-island': 'Rhode Island', 'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota', 'tennessee': 'Tennessee', 'texas': 'Texas', 'utah': 'Utah',
  'vermont': 'Vermont', 'virginia': 'Virginia', 'washington': 'Washington', 'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin', 'wyoming': 'Wyoming', 'district-of-columbia': 'District of Columbia'
};

/**
 * Get nearby states for a given state slug
 * @param stateSlug The full state slug (e.g., 'california', 'new-york')
 * @returns Array of nearby state objects with slug and name
 */
export function getNearbyStates(stateSlug: string): Array<{ slug: string; name: string }> {
  const nearby = nearbyStates[stateSlug.toLowerCase()] || [];
  return nearby.map(slug => ({
    slug,
    name: stateDisplayNames[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }));
}