export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

// Generate state slug from state name or abbreviation
export function getStateSlug(state: string | null | undefined): string {
  if (!state) return '';
  
  const stateLower = state.toLowerCase().trim();
  
  // Map of abbreviations to full state slugs
  const abbrevToFullSlug: Record<string, string> = {
    'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas',
    'ca': 'california', 'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware',
    'fl': 'florida', 'ga': 'georgia', 'hi': 'hawaii', 'id': 'idaho',
    'il': 'illinois', 'in': 'indiana', 'ia': 'iowa', 'ks': 'kansas',
    'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
    'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi',
    'mo': 'missouri', 'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada',
    'nh': 'new-hampshire', 'nj': 'new-jersey', 'nm': 'new-mexico', 'ny': 'new-york',
    'nc': 'north-carolina', 'nd': 'north-dakota', 'oh': 'ohio', 'ok': 'oklahoma',
    'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode-island', 'sc': 'south-carolina',
    'sd': 'south-dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah',
    'vt': 'vermont', 'va': 'virginia', 'wa': 'washington', 'wv': 'west-virginia',
    'wi': 'wisconsin', 'wy': 'wyoming', 'dc': 'district-of-columbia'
  };
  
  // If it's a 2-letter abbreviation, convert to full slug
  if (stateLower.length === 2 && abbrevToFullSlug[stateLower]) {
    return abbrevToFullSlug[stateLower];
  }
  
  // Otherwise, slugify the full state name
  return slugify(state);
}

// Map state slugs back to full state names
export function getStateNameFromSlug(slug: string): string {
  const slugToName: Record<string, string> = {
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
  
  return slugToName[slug] || slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Get state abbreviation from state name
export function getStateAbbreviation(stateName: string): string {
  const nameToAbbrev: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
  };
  
  return nameToAbbrev[stateName] || stateName;
}