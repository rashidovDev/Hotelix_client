import { CalendarDays, MapPin, SlidersHorizontal, Users } from "lucide-react";
import FilterSection from "@/components/hotels/FilterSection";

const popularFilterOptions = [
  "Budget hotel",
  "Breakfast included",
  "Free airport shuttle",
  "Hostel/Backpacker",
] as const;

interface SidebarProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  maxPrice: number;
  selectedFilters: string[];
  onDestinationChange: (value: string) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onToggleFilter: (filter: string) => void;
  onMaxPriceChange: (value: number) => void;
}

export default function Sidebar({
  destination,
  checkIn,
  checkOut,
  guests,
  maxPrice,
  selectedFilters,
  onDestinationChange,
  onCheckInChange,
  onCheckOutChange,
  onToggleFilter,
  onMaxPriceChange,
}: SidebarProps) {
  return (
    <aside className="h-fit rounded-2xl bg-white p-5 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.45)] md:sticky md:top-6">
      <h2 className="text-xl font-bold text-slate-900">Your search</h2>

      <div className="mt-5 space-y-4">
        <FilterSection title="Destination">
          <label className="relative block">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={destination}
              onChange={(event) => onDestinationChange(event.target.value)}
              placeholder="Copenhagen, Denmark"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>
        </FilterSection>

        <FilterSection title="Check-in date">
          <label className="relative block">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>
        </FilterSection>

        <FilterSection title="Check-out date">
          <label className="relative block">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(event) => onCheckOutChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>
        </FilterSection>

        <FilterSection title="Guests">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{guests}</span>
          </div>
        </FilterSection>

        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Search
        </button>

        <FilterSection title="Popular filters">
          <div className="space-y-2.5">
            {popularFilterOptions.map((filter) => (
              <label key={filter} className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => onToggleFilter(filter)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{filter}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price per night">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Up to ${maxPrice}</span>
            </div>
            <input
              type="range"
              min={80}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(Number(event.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
