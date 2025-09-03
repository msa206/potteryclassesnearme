import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function countCities() {
  const { data, error } = await supabase
    .from('providers_raw')
    .select('city, state');
  
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  // Count unique city-state combinations
  const uniqueCities = new Set();
  const statesWithCities = new Map();
  
  data?.forEach(row => {
    if (row.city && row.state) {
      const cityKey = `${row.city}, ${row.state}`;
      uniqueCities.add(cityKey);
      
      if (!statesWithCities.has(row.state)) {
        statesWithCities.set(row.state, new Set());
      }
      statesWithCities.get(row.state).add(row.city);
    }
  });

  console.log(`Total unique cities: ${uniqueCities.size}`);
  console.log(`Total states with cities: ${statesWithCities.size}`);
  console.log(`Total provider records: ${data?.length || 0}`);
  
  // Show top states by city count
  const statesSorted = Array.from(statesWithCities.entries())
    .map(([state, cities]) => ({ state, cityCount: cities.size }))
    .sort((a, b) => b.cityCount - a.cityCount)
    .slice(0, 10);
  
  console.log('\nTop 10 states by number of cities:');
  statesSorted.forEach(({ state, cityCount }) => {
    console.log(`  ${state}: ${cityCount} cities`);
  });
}

countCities();