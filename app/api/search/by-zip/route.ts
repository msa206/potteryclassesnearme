import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const zip = (req.nextUrl.searchParams.get("zip") || "").trim();
  const radius = Number(req.nextUrl.searchParams.get("radius") || "50");
  const limit = Number(req.nextUrl.searchParams.get("limit") || "100");

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP (use 5 digits)" }, { status: 400 });
  }

  const sb = supabaseServer();

  // Since we no longer have the RPC function, we'll need to handle ZIP search differently
  // For now, we'll search for providers with matching ZIP codes
  const { data: providers, error } = await sb
    .from("providers_raw")
    .select("*")
    .eq("zip", zip);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // The providers already have state_slug in providers_raw
  const enriched = (providers || []).map((p: any) => ({
    ...p,
    distance_miles: 0, // We don't have distance calculation without PostGIS
  }));

  return NextResponse.json(enriched);
}