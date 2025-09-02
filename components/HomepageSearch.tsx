"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function HomepageSearch() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    
    if (!trimmedLocation) return;

    setLoading(true);

    // Check if it's a ZIP code (5 digits)
    if (/^\d{5}$/.test(trimmedLocation)) {
      // For ZIP codes, redirect to the ZIP-specific route
      router.push(`/pottery-classes/zip/${trimmedLocation}?radius=50`);
    } else {
      // For city/state searches, use the existing search functionality
      router.push(`/search?location=${encodeURIComponent(trimmedLocation)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-ink/10">
        <input
          type="text"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city, state, or ZIP code..."
          className="flex-1 px-6 py-4 text-lg bg-transparent outline-none placeholder:text-ink/40"
          required
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="px-8 py-4 text-lg font-semibold rounded-xl"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Classes"}
        </Button>
      </div>
      <p className="text-xs text-ink/50 mt-2 text-center">
        Search by city name, state, or 5-digit ZIP code
      </p>
    </form>
  );
}