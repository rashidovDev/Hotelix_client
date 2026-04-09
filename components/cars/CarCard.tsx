import Link from "next/link";
import { Fuel, Gauge, MapPin, Star, Users } from "lucide-react";
import { routes } from "@/config/routes";

export interface CarItem {
  id: string;
  name: string;
  location: string;
  transmission: "Automatic" | "Manual";
  seats: number;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  rating: number;
  reviews: number;
  pricePerDay: number;
  image: string;
  tags: string[];
}

export default function CarCard({ car }: { car: CarItem }) {
  return (
    <Link href={`${routes.search}?category=cars&id=${car.id}`} className="group block">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]">
        <div className="relative h-52 bg-slate-100">
          <img
            src={car.image}
            alt={car.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/45 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {car.location}
          </div>

          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
            {car.rating.toFixed(1)}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="truncate text-lg font-semibold text-slate-900">{car.name}</h3>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {car.seats} seats
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Fuel className="h-4 w-4" />
              {car.fuel}
            </span>
          </div>

          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Star className="h-3.5 w-3.5 fill-current" />
            {car.rating.toFixed(1)} ({car.reviews})
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 inline-flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {car.transmission}
            </span>
            {car.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-lg font-bold text-slate-900">${car.pricePerDay}/day</p>
            </div>
            <span className="text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
              View car
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
