import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Star } from "lucide-react";
import { routes } from "@/config/routes";

export interface TourItem {
  id: string;
  title: string;
  city: string;
  country: string;
  duration: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  image: string;
  highlights: string[];
}

export default function TourCard({ tour }: { tour: TourItem }) {
  return (
    <Link
      href={`${routes.destinations}?tour=${tour.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]">
        <div className="relative h-52 bg-slate-100">
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/45 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {tour.city}
          </div>

          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
            {tour.rating.toFixed(1)}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {tour.title}
          </h3>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {tour.duration}
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Free cancel
            </span>
          </div>

          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Star className="h-3.5 w-3.5 fill-current" />
            {tour.rating.toFixed(1)} ({tour.reviewCount})
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {tour.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-lg font-bold text-slate-900">${tour.priceFrom}</p>
            </div>
            <span className="text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
              View tour
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
