/**
 * Map of each state to its neighboring/nearby states
 * Based on actual geographic borders
 */
export const nearbyStates: Record<string, string[]> = {
  // Northeast
  'me': ['nh', 'ma', 'vt'],
  'nh': ['me', 'vt', 'ma'],
  'vt': ['nh', 'ma', 'ny'],
  'ma': ['ri', 'ct', 'nh', 'vt', 'ny'],
  'ri': ['ma', 'ct'],
  'ct': ['ma', 'ri', 'ny'],
  'ny': ['vt', 'ma', 'ct', 'nj', 'pa'],
  'nj': ['ny', 'pa', 'de'],
  'pa': ['ny', 'nj', 'de', 'md', 'wv', 'oh'],
  'de': ['md', 'pa', 'nj'],
  'md': ['pa', 'wv', 'va', 'de', 'dc'],
  'dc': ['md', 'va'],
  
  // Southeast
  'va': ['md', 'wv', 'ky', 'tn', 'nc', 'dc'],
  'wv': ['pa', 'md', 'va', 'ky', 'oh'],
  'nc': ['va', 'tn', 'ga', 'sc'],
  'sc': ['nc', 'ga'],
  'ga': ['nc', 'sc', 'fl', 'al', 'tn'],
  'fl': ['ga', 'al'],
  'ky': ['in', 'oh', 'wv', 'va', 'tn', 'mo', 'il'],
  'tn': ['ky', 'va', 'nc', 'ga', 'al', 'ms', 'ar', 'mo'],
  'al': ['tn', 'ga', 'fl', 'ms'],
  'ms': ['tn', 'al', 'la', 'ar'],
  'la': ['tx', 'ar', 'ms'],
  'ar': ['mo', 'tn', 'ms', 'la', 'tx', 'ok'],
  
  // Midwest
  'oh': ['mi', 'pa', 'wv', 'ky', 'in'],
  'mi': ['wi', 'in', 'oh'],
  'in': ['mi', 'oh', 'ky', 'il'],
  'il': ['wi', 'in', 'ky', 'mo', 'ia'],
  'wi': ['mi', 'mn', 'ia', 'il'],
  'mn': ['wi', 'ia', 'sd', 'nd'],
  'ia': ['mn', 'wi', 'il', 'mo', 'ne', 'sd'],
  'mo': ['ia', 'il', 'ky', 'tn', 'ar', 'ok', 'ks', 'ne'],
  'nd': ['mn', 'sd', 'mt'],
  'sd': ['nd', 'mn', 'ia', 'ne', 'wy', 'mt'],
  'ne': ['sd', 'ia', 'mo', 'ks', 'co', 'wy'],
  'ks': ['ne', 'mo', 'ok', 'co'],
  
  // Southwest
  'ok': ['ks', 'mo', 'ar', 'tx', 'nm', 'co'],
  'tx': ['nm', 'ok', 'ar', 'la'],
  'nm': ['co', 'ok', 'tx', 'az', 'ut'],
  'az': ['ca', 'nv', 'ut', 'nm'],
  'co': ['wy', 'ne', 'ks', 'ok', 'nm', 'ut'],
  'ut': ['id', 'wy', 'co', 'az', 'nv'],
  'nv': ['id', 'ut', 'az', 'ca', 'or'],
  
  // West
  'ca': ['or', 'nv', 'az'],
  'or': ['wa', 'id', 'nv', 'ca'],
  'wa': ['id', 'or'],
  'id': ['mt', 'wy', 'ut', 'nv', 'or', 'wa'],
  'mt': ['nd', 'sd', 'wy', 'id'],
  'wy': ['mt', 'sd', 'ne', 'co', 'ut', 'id'],
  
  // Non-contiguous
  'ak': [], // Alaska has no bordering states
  'hi': []  // Hawaii has no bordering states
};

/**
 * Get the display name for a state from its slug
 */
export const stateDisplayNames: Record<string, string> = {
  'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas',
  'ca': 'California', 'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware',
  'fl': 'Florida', 'ga': 'Georgia', 'hi': 'Hawaii', 'id': 'Idaho',
  'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa', 'ks': 'Kansas',
  'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
  'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi',
  'mo': 'Missouri', 'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada',
  'nh': 'New Hampshire', 'nj': 'New Jersey', 'nm': 'New Mexico', 'ny': 'New York',
  'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio', 'ok': 'Oklahoma',
  'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
  'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah',
  'vt': 'Vermont', 'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia',
  'wi': 'Wisconsin', 'wy': 'Wyoming', 'dc': 'District of Columbia'
};

/**
 * Get nearby states for a given state slug
 * @param stateSlug The two-letter state abbreviation
 * @returns Array of nearby state objects with slug and name
 */
export function getNearbyStates(stateSlug: string): Array<{ slug: string; name: string }> {
  const nearby = nearbyStates[stateSlug.toLowerCase()] || [];
  return nearby.map(slug => ({
    slug,
    name: stateDisplayNames[slug] || slug.toUpperCase()
  }));
}