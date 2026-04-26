"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import HotelCardWithSubscription from "@/components/hotels/HotelCardWithSubscription";
import { HotelListItem } from "@/components/hotels/HotelCard";
import Sidebar from "@/components/hotels/Sidebar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { routes } from "@/config/routes";
import { GET_ALL_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";

type SortOption = "recommended" | "price_low" | "price_high" | "rating";

interface GuestCounts {
  adults: number;
  children: number;
  babies: number;
}

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

function mapApiHotelToListItem(hotel: HotelEntity): HotelListItem {
  const basePrice = Math.floor(Math.random() * 300) + 200; // 200-500
  const reviewCount = Math.floor(Math.random() * 2000) + 300; // 300-2300
  const rating = hotel.rating ? Number(hotel.rating) : 8.5;

  return {
    id: hotel.id,
    name: hotel.name,
    image: hotel.images?.[0] || "/hotel.jpg",
    rating,
    reviews: reviewCount,
    distance: `${hotel.location || hotel.city}`,
    roomType: "Standard room",
    bedType: "1x king size bed",
    bathroom: "1x bathroom",
    price: basePrice,
    tags: hotel.amenities?.slice(0, 2) || ["Check availability"],
    dealTags: rating >= 9 ? ["#Hot deal"] : rating >= 8.5 ? ["#Popular"] : [],
  };
}

export default function HotelsContent() {
  const searchParams = useSearchParams();
  const { data, loading, error } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);
  const ownerId = searchParams?.get("ownerId")?.trim() || "";
  const initialCity = searchParams?.get("city")?.trim() || "";

  // Draft values edited in sidebar inputs
  const [draftDestination, setDraftDestination] = useState(initialCity);
  const [draftCheckIn, setDraftCheckIn] = useState("2026-12-09");
  const [draftCheckOut, setDraftCheckOut] = useState("2026-12-12");
  const [draftGuestCounts, setDraftGuestCounts] = useState<GuestCounts>({
    adults: 2,
    children: 0,
    babies: 0,
  });
  const [draftSelectedFilters, setDraftSelectedFilters] = useState<string[]>([]);
  const [draftMaxPrice, setDraftMaxPrice] = useState(450);

  // Applied values used to filter result list
  const [destination, setDestination] = useState(initialCity);
  const [checkIn, setCheckIn] = useState("2026-12-09");
  const [checkOut, setCheckOut] = useState("2026-12-12");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [maxPrice, setMaxPrice] = useState(450);

  const filteredHotels = useMemo(() => {
    const apiHotels = data?.findAllHotels || [];
    const ownerFilteredHotels = ownerId
      ? apiHotels.filter((hotel) => hotel.ownerId === ownerId)
      : apiHotels;
    const hotels = ownerFilteredHotels.map(mapApiHotelToListItem);
    const normalizedDestination = destination.trim().toLowerCase();

    let result = hotels.filter((hotel) => {
      const matchesDestination =
        normalizedDestination.length === 0 ||
        hotel.name.toLowerCase().includes(normalizedDestination) ||
        hotel.distance.toLowerCase().includes(normalizedDestination);

      const matchesPopularFilters = selectedFilters.every(
        (filter) => hotel.tags.includes(filter) || filter === "Hostel/Backpacker"
      );

      const matchesPrice = hotel.price <= maxPrice;

      return matchesDestination && matchesPopularFilters && matchesPrice;
    });

    result = [...result];

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [data, destination, selectedFilters, sortBy, maxPrice, ownerId]);

  const toggleFilter = (filter: string) => {
    setDraftSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const applySearch = () => {
    setDestination(draftDestination);
    setCheckIn(draftCheckIn);
    setCheckOut(draftCheckOut);
    setSelectedFilters(draftSelectedFilters);
    setMaxPrice(draftMaxPrice);
  };

  const updateGuestCount = (type: keyof GuestCounts, value: number) => {
    setDraftGuestCounts((prev) => ({ ...prev, [type]: value }));
  };

  const guestSummary = `${draftGuestCounts.adults} adult${draftGuestCounts.adults === 1 ? "" : "s"}, ${draftGuestCounts.children} child${draftGuestCounts.children === 1 ? "" : "ren"}, ${draftGuestCounts.babies} baby${draftGuestCounts.babies === 1 ? "" : "ies"}`;

  return (
    <div className="mx-auto w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:w-[80%] lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: routes.home },
          { label: ownerId ? "Host's Hotels" : "Search results", href: routes.hotels },
          { label: ownerId ? "Filtered results" : destination || "All hotels" },
        ]}
        className="mb-6"
      />

        <div className="flex flex-col gap-4 lg:gap-6 lg:flex-row">
          <Sidebar
            destination={draftDestination}
            checkIn={draftCheckIn}
            checkOut={draftCheckOut}
            guestCounts={draftGuestCounts}
            maxPrice={draftMaxPrice}
            selectedFilters={draftSelectedFilters}
            onDestinationChange={setDraftDestination}
            onCheckInChange={setDraftCheckIn}
            onCheckOutChange={setDraftCheckOut}
            onGuestCountChange={updateGuestCount}
            onToggleFilter={toggleFilter}
            onMaxPriceChange={setDraftMaxPrice}
            onSearch={applySearch}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                {loading
                  ? "Loading..."
                  : ownerId
                    ? `${filteredHotels.length} hotels from this host`
                    : `${filteredHotels.length} search results for ${destination}, ${checkIn.split("-")[2]} - ${checkOut.split("-")[2]} Dec, ${guestSummary}, 1 room`}
              </p>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <span className="font-medium">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_low">Price (low to high)</option>
                  <option value="price_high">Price (high to low)</option>
                  <option value="rating">Rating</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              {loading && (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-md">
                  Loading hotels...
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-50 p-8 text-center text-sm text-red-600 shadow-md border border-red-200">
                  Failed to load hotels. Please try again.
                </div>
              )}

              {!loading && !error && filteredHotels.map((hotel) => (
                <HotelCardWithSubscription key={hotel.id} hotel={hotel} />
              ))}

              {!loading && !error && filteredHotels.length === 0 && (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-md">
                  No hotels match the selected filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
