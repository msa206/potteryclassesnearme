// app/components/SearchByZipForm.tsx
import { searchByZipAction } from '@/app/actions/searchByZip';

export default function SearchByZipForm() {
  return (
    <form action={searchByZipAction} className="flex gap-2">
      <input
        type="text"
        name="zip"
        inputMode="numeric"
        pattern="\d{5}"
        maxLength={5}
        placeholder="Enter ZIP"
        className="border rounded px-3 py-2 w-40"
        aria-label="Enter ZIP code"
        required
      />
      <button type="submit" className="px-4 py-2 rounded bg-[#D08C72] text-white">
        Find classes
      </button>
    </form>
  );
}