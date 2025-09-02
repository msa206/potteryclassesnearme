// app/components/SearchByZipForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchByZipForm() {
  const router = useRouter();
  const [zip, setZip] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = (zip || "").trim().slice(0, 5);
    if (!/^\d{5}$/.test(cleaned)) {
      alert("Please enter a valid 5-digit ZIP.");
      return;
    }
    router.push(`/pottery-classes/zip/${cleaned}?radius=50`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        inputMode="numeric"
        pattern="\d{5}"
        maxLength={5}
        placeholder="Enter ZIP"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        className="border rounded px-3 py-2 w-40"
        aria-label="Enter ZIP code"
      />
      <button type="submit" className="px-4 py-2 rounded bg-[#D08C72] text-white">
        Find classes
      </button>
    </form>
  );
}