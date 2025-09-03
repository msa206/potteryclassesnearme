import { NextResponse } from 'next/server';
import { supabaseStatic } from '@/lib/db';

export async function GET() {
  const supabase = supabaseStatic();
  
  const { data, error } = await supabase
    .from('providers_raw')
    .select('city, state');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Count unique city-state combinations
  const uniqueCities = new Set();
  const statesWithCities = new Map();
  
  data?.forEach((row: any) => {
    if (row.city && row.state) {
      const cityKey = `${row.city}, ${row.state}`;
      uniqueCities.add(cityKey);
      
      if (!statesWithCities.has(row.state)) {
        statesWithCities.set(row.state, new Set());
      }
      statesWithCities.get(row.state)?.add(row.city);
    }
  });

  // Get top states by city count
  const statesSorted = Array.from(statesWithCities.entries())
    .map(([state, cities]) => ({ state, cityCount: cities.size }))
    .sort((a, b) => b.cityCount - a.cityCount)
    .slice(0, 10);

  return NextResponse.json({
    totalUniqueCities: uniqueCities.size,
    totalStates: statesWithCities.size,
    totalProviders: data?.length || 0,
    topStates: statesSorted
  });
}