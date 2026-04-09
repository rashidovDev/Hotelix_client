"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";
import { routes } from "@/config/routes";
import HotelCard from "./HotelCard";

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

export default function FeaturedHotels() {
  const { data, loading, error } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);

  const hotels = data?.findAllHotels?.slice(0, 4) || [];

  return (
    <section className="w-full ">
    <div className="mx-auto w-full px-4 py-14  sm:px-6 lg:w-[70vw] lg:px-0">
      <div className="mb-8 flex flex-col gap-2 sm:mb-10">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          Stay Picks
        </p> */}
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Recommended Hotels
        </h2>
        {/* <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
          Curated stays with great locations, thoughtful amenities, and top guest experiences.
        </p> */}
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 py-8 text-center text-red-600">
          Failed to load hotels. Please try again.
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}

      {!loading && hotels.length === 0 && (
        <div className="rounded-2xl border border-slate-200 py-8 text-center text-slate-400">
          No hotels found yet.
        </div>
      )}

      {!loading && !error && hotels.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={routes.search}
            className="inline-flex items-center rounded-xl border border-blue-500 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600"
          >
            View all Hotels
          </Link>
        </div>
      )}
    </div>
    </section>
  );
}