import { searchByZipAction } from '@/app/actions/searchByZip'

export default function ZipSearch({
  defaultRadius = 50,
  initialZip = "",
  className = "",
  error = null,
}: {
  defaultRadius?: number;
  initialZip?: string;
  className?: string;
  error?: string | null;
}) {
  return (
    <div className={`w-full ${className}`}>
      <form action={searchByZipAction} className="flex flex-col sm:flex-row gap-3">
        <input
          name="zip"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="Enter ZIP code (e.g., 33101)"
          defaultValue={initialZip}
          className="flex-1 sm:flex-initial sm:w-48 px-4 py-3 text-lg bg-white border border-sand/30 rounded-xl outline-none focus:border-teal transition-colors"
          aria-label="ZIP code"
          required
        />
        <select
          name="radius"
          defaultValue={defaultRadius}
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
        >
          Search by ZIP
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-ink/60">
          Enter a ZIP code to find pottery studios within {defaultRadius} miles.
        </p>
      </div>
    </div>
  );
}