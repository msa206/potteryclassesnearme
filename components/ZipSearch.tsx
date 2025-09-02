"use client";

import { useState } from "react";
import Link from "next/link";

type Studio = {
  id: string;
  name: string;
  provider_slug: string;
  city: string;
  state: string;         // e.g., "KY"
  city_slug: string;     // FK from providers
  state_slug?: string;   // added by API
  distance_miles?: number;
  rating?: number;
  review_count?: number;
  street?: string;
  zip?: string;
  phone?: string;
};

export default function ZipSearch({
  defaultRadius = 50,
  initialZip = "",
  className = "",
}: {
  defaultRadius?: number;
  initialZip?: string;
  className?: string;
}) {
  const [zip, setZip] = useState(initialZip);
  const [radius, setRadius] = useState(defaultRadius);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Studio[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search/by-zip?zip=${zip}&radius=${radius}&limit=100`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setResults(data as Studio[]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="Enter ZIP code (e.g., 33101)"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
          className="flex-1 sm:flex-initial sm:w-48 px-4 py-3 text-lg bg-white border border-sand/30 rounded-xl outline-none focus:border-teal transition-colors"
          aria-label="ZIP code"
          autoFocus
        />
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full sm:w-32 px-4 py-3 text-lg bg-white border border-sand/30 rounded-xl outline-none focus:border-teal transition-colors"
          aria-label="Radius in miles"
        >
          {[10, 25, 50, 75, 100].map((r) => (
            <option key={r} value={r}>{r} miles</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-3 text-lg font-semibold text-white bg-teal hover:bg-clay rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search by ZIP"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && !error && results.length === 0 && (
        <div className="mt-8 p-8 bg-white rounded-xl text-center">
          <p className="text-lg text-ink/60">
            No pottery studios found within {radius} miles of ZIP code {zip}.
          </p>
          <p className="mt-2 text-ink/50">
            Try increasing the search radius or searching a different ZIP code.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-ink mb-2">
              Found {results.length} Pottery Studio{results.length === 1 ? "" : "s"}
            </h2>
            <p className="text-ink/60">
              Within {radius} miles of ZIP code {zip}
              {results[0]?.distance_miles != null && " • Sorted by distance"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((studio) => {
              const stateSlug = studio.state_slug || String(studio.state || "").toLowerCase();
              const href = `/pottery-classes/${stateSlug}/${studio.city_slug}/${studio.provider_slug}`;

              return (
                <div key={studio.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={href} className="block group flex-1">
                      <h3 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors">
                        {studio.name}
                      </h3>
                    </Link>
                    {studio.distance_miles != null && (
                      <span className="text-sm font-medium text-teal bg-teal/10 px-2 py-1 rounded-lg">
                        {studio.distance_miles.toFixed(1)} mi
                      </span>
                    )}
                  </div>
                  
                  <div className="text-ink/60 space-y-1">
                    {studio.street && (
                      <p className="text-sm">
                        {studio.street}, {studio.city}, {studio.state} {studio.zip}
                      </p>
                    )}
                    
                    {!studio.street && (
                      <p className="text-sm">
                        {studio.city}, {studio.state}
                      </p>
                    )}
                    
                    {studio.phone && (
                      <p className="text-sm">
                        <a href={`tel:${studio.phone}`} className="hover:text-teal">
                          {studio.phone}
                        </a>
                      </p>
                    )}
                    
                    {studio.rating != null && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-ink">
                          {Number(studio.rating).toFixed(1)}
                        </span>
                        <span className="text-sm text-ink/50">
                          ({studio.review_count || 0} review{studio.review_count !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 mt-4 text-teal hover:text-clay transition-colors text-sm font-medium"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="mt-6 text-center">
          <p className="text-ink/60">
            Enter a ZIP code to find pottery studios within {radius} miles.
          </p>
        </div>
      )}
    </div>
  );
}