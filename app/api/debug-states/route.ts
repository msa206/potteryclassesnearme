import { NextResponse } from "next/server";
import { supabaseStatic } from "@/lib/db";

export async function GET() {
  const supabase = supabaseStatic();
  
  // Get all unique states from cities table
  const { data: citiesData, error: citiesError } = await supabase
    .from('cities_new')
    .select('state, state_slug')
    .order('state');
  
  if (citiesError) {
    return NextResponse.json({ error: citiesError.message }, { status: 500 });
  }
  
  // Deduplicate states
  const uniqueStates = citiesData ? Array.from(new Set(citiesData.map(c => c.state))).map(state => {
    const stateData = citiesData.find(c => c.state === state);
    return { state, state_slug: stateData?.state_slug };
  }).filter(s => s.state && s.state_slug) : [];
  
  // Also get count of cities per state
  const stateCounts: Record<string, number> = {};
  citiesData?.forEach(city => {
    stateCounts[city.state] = (stateCounts[city.state] || 0) + 1;
  });
  
  return NextResponse.json({
    totalCities: citiesData?.length || 0,
    totalStates: uniqueStates.length,
    states: uniqueStates,
    citiesPerState: stateCounts,
    rawData: citiesData?.slice(0, 10) // First 10 cities for debugging
  });
}