import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { filterByDistance } from "@/lib/distance";
import { getStateSlug, slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  const zip = (req.nextUrl.searchParams.get("zip") || "").trim();
  const radius = Math.min(Math.max(Number(req.nextUrl.searchParams.get("radius") || "50"), 1), 200);
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit") || "100"), 1), 500);

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP (use 5 digits)" }, { status: 400 });
  }

  const sb = supabaseServer();

  // Get coordinates from the ZIP code database
  const { data: zipData } = await sb
    .from("_zip_import")
    .select("lat, lng, city, state")
    .eq("zip", zip)
    .single();

  if (!zipData || !zipData.lat || !zipData.lng) {
    return NextResponse.json({ 
      error: `No location data found for ZIP ${zip}` 
    }, { status: 404 });
  }

  // Fetch all providers with coordinates
  const { data: allProviders, error } = await sb
    .from("providers_raw")
    .select("id, name, city, state, street, postal_code, phone_number, review_stars, review_count, working_hours, site, latitude, longitude")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter by distance and add slugs
  const filtered = filterByDistance(
    allProviders || [],
    zipData.lat,
    zipData.lng,
    radius
  ).slice(0, limit);

  // Enrich with slugs for frontend navigation
  const enriched = filtered.map((p) => ({
    ...p,
    provider_slug: slugify(p.name || ""),
    city_slug: slugify(p.city || ""),
    state_slug: getStateSlug(p.state || ""),
    // Map to expected field names
    rating: p.review_stars,
    zip: p.postal_code,
    phone: p.phone_number,
    website: p.site
  }));

  return NextResponse.json(enriched);
}