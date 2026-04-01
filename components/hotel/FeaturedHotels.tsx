"use client";

import { useQuery } from "@apollo/client/react";
import { GET_ALL_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";
import HotelCard from "./HotelCard";

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

export default function FeaturedHotels() {
  const { data, loading, error } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);

  const hotels = data?.findAllHotels?.slice(0, 6) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Featured Hotels</h2>
        <p className="text-gray-500">Handpicked top hotels just for you</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-8">
          Failed to load hotels. Please try again.
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}

      {!loading && hotels.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No hotels found yet.
        </div>
      )}
    </section>
  );
}