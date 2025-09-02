import { NextResponse } from "next/server";
import { supabaseStatic } from "@/lib/db";

export async function GET() {
  const supabase = supabaseStatic();
  
  // Get all unique states from providers_raw table
  const { data: providersData, error: providersError } = await supabase
    .from('providers_raw')
    .select('state')
    .order('state');
  
  if (providersError) {
    return NextResponse.json({ error: providersError.message }, { status: 500 });
  }
  
  // Deduplicate states
  const uniqueStates = providersData ? Array.from(new Set(providersData.map((p: any) => p.state))).map((state: string) => {
    return { state };
  }).filter((s: { state: string }) => s.state) : [];
  
  // Also get count of providers per state
  const stateCounts: Record<string, number> = {};
  providersData?.forEach((provider: any) => {
    stateCounts[provider.state] = (stateCounts[provider.state] || 0) + 1;
  });
  
  return NextResponse.json({
    totalProviders: providersData?.length || 0,
    totalStates: uniqueStates.length,
    states: uniqueStates,
    providersPerState: stateCounts,
    rawData: providersData?.slice(0, 10) // First 10 providers for debugging
  });
}