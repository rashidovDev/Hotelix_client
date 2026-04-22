"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";
import { routes } from "@/config/routes";
import HotelCard from "./HotelCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

export default function FeaturedHotels() {
  const { data, loading, error } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const hotels = data?.findAllHotels?.slice(0, 6) || [];

  const updateScrollState = () => {
    const container = carouselRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = Math.max(container.clientWidth * 0.75, 260);
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCarouselScroll = () => {
    updateScrollState();
  };

  useEffect(() => {
    updateScrollState();

    window.addEventListener("resize", updateScrollState);

    return () => window.removeEventListener("resize", updateScrollState);
  }, [hotels.length]);

  return (
    <section className="w-full">
      <div className="mx-auto w-full px-4 py-14 sm:px-6 lg:w-[80%] lg:px-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl  font-bold tracking-tight text-slate-900 sm:text-4xl">
           Recommended Hotels
          </h2>
          <Link
            href={routes.hotels}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          {loading && (
            <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-95 w-[18rem] flex-none animate-pulse rounded-2xl bg-slate-100 sm:w-[20rem]"
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
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
            >
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}

          {!loading && !error && hotels.length > 0 && (
            <>
              <button
                type="button"
                aria-label="Previous hotels"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 text-slate-700 shadow-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 lg:block"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next hotels"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 text-slate-700 shadow-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 lg:block"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {!loading && hotels.length === 0 && (
          <div className="rounded-2xl border border-slate-200 py-8 text-center text-slate-400">
            No hotels found yet.
          </div>
        )}
      </div>
    </section>
  );
}