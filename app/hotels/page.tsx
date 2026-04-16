"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import HotelCard, { HotelListItem } from "@/components/hotels/HotelCard";
import Sidebar from "@/components/hotels/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { GET_ALL_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";

type SortOption = "recommended" | "price_low" | "price_high" | "rating";

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

function mapApiHotelToListItem(hotel: HotelEntity): HotelListItem {
  const basePrice = Math.floor(Math.random() * 300) + 200; // 200-500
  const reviewCount = Math.floor(Math.random() * 2000) + 300; // 300-2300
  const rating = hotel.rating ? Number(hotel.rating) : 8.5;

  return {
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

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const { data, loading, error } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);
  
  // Initialize destination from URL query parameter
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("2026-12-09");
  const [checkOut, setCheckOut] = useState("2026-12-12");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [maxPrice, setMaxPrice] = useState(450);

  // Read city from query parameter on mount
  useEffect(() => {
    const cityParam = searchParams?.get("city");
    if (cityParam) {
      setDestination(cityParam);
    }
  }, [searchParams]);

  const filteredHotels = useMemo(() => {
    const apiHotels = data?.findAllHotels || [];
    const hotels = apiHotels.map(mapApiHotelToListItem);
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
  }, [data, destination, selectedFilters, sortBy, maxPrice]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div
        className="relative min-h-[36vh] overflow-hidden"
        style={{
          backgroundImage: "url('/hotel.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="relative z-10">
          <Navbar />
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl">
              {destination ? `Hotels in ${destination}` : "Hotels"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-50 sm:text-base">
              Compare stays, filter smarter, and book your perfect city escape.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-10 lg:w-[80%] lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <Sidebar
            destination={destination}
            checkIn={checkIn}
            checkOut={checkOut}
            guests="2 adults, 1 room"
            maxPrice={maxPrice}
            selectedFilters={selectedFilters}
            onDestinationChange={setDestination}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onToggleFilter={toggleFilter}
            onMaxPriceChange={setMaxPrice}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                {loading ? "Loading..." : `${filteredHotels.length} search results for ${destination}, ${checkIn.split("-")[2]} - ${checkOut.split("-")[2]} Dec, 2 guests, 1 room`}
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
                <HotelCard key={hotel.name} hotel={hotel} />
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
    </section>
  );
}
