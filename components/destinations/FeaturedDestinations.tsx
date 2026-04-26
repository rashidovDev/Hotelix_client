"use client";

import Link from "next/link";
import { routes } from "@/config/routes";

const destinations = [
  {
    name: "Barcelona",
    image: "/destinations/baarca.jpg",
    className: "xl:col-start-1 xl:row-start-1 xl:row-span-2",
  },
  {
    name: "Seoul",
    image: "/destinations/seoul.jpg",
    className: "xl:col-start-2 xl:row-start-1",
  },
  {
    name: "Kuala Lumpur",
    image: "/destinations/kuala.jpg",
    className: "xl:col-start-2 xl:row-start-2",
  },
  {
    name: "Dubai",
    image: "/destinations/duba.jpg",
    className: "xl:col-start-3 xl:row-start-1 xl:row-span-2",
  },
  {
    name: "Tashkent",
    image: "/destinations/tashkent.jpg",
    className: "xl:col-start-4 xl:row-start-1",
  },
  {
    name: "Bali",
    image: "/destinations/ba.jpg",
    className: "xl:col-start-4 xl:row-start-2",
  },
] as const;

function DestinationCard({ name, image, className }: (typeof destinations)[number]) {
  return (
    <article 
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
      onClick={() => {
        window.location.href = `${routes.hotels}?city=${encodeURIComponent(name)}`;
      }}
    >
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-105"
      />
      <div className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/5" />
      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-900 shadow-sm backdrop-blur-sm">
        {name}
      </div>
    </article>
  );
}

export default function FeaturedDestinations() {
  return (
    <section className="mx-auto my-6 sm:my-10 w-full px-4 sm:px-6 lg:w-[80%] lg:px-0" style={{ minHeight: 320 }}>
      <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Popular destinations</h2>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2 xl:auto-rows-fr min-h-[300px] sm:min-h-[350px] lg:min-h-[420px]">
        {destinations.map((destination) => (
          <DestinationCard key={destination.name} {...destination} />
        ))}
      </div>
    </section>
  );
}