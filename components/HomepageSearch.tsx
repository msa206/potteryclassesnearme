import Button from "@/components/Button";
import { searchLocationAction } from "@/app/actions/searchLocation";

export default function HomepageSearch() {
  return (
    <form action={searchLocationAction} className="relative">
      <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-ink/10">
        <input
          type="text"
          name="location"
          placeholder="Enter city, state, or ZIP code..."
          className="flex-1 px-6 py-4 text-lg bg-transparent outline-none placeholder:text-ink/40"
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="px-8 py-4 text-lg font-semibold rounded-xl"
        >
          Search Classes
        </Button>
      </div>
      <p className="text-xs text-white/80 mt-2 text-center">
        Search by city name, state, or 5-digit ZIP code
      </p>
    </form>
  );
}