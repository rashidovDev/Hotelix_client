import Link from "next/link";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import { routes } from "@/config/routes";

export interface GuideItem {
  id: string;
  name: string;
  city: string;
  country: string;
  priceFrom: number;
  rating: number;
  reviewCount: number;
  image: string;
  specialty: string;
}

export default function GuideCard({ guide }: { guide: GuideItem }) {
  return (
    <Link
      href={`${routes.guides}?guide=${guide.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]">
        <div className="relative h-52 bg-slate-100">
          <img
            src={guide.image}
            alt={guide.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/45 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {guide.city}
          </div>

          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
            {guide.rating.toFixed(1)}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {guide.name}
            </h3>
            <p className="text-sm text-slate-500">
              {guide.city}, {guide.country}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            {guide.specialty}
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-lg font-bold text-slate-900">${guide.priceFrom}</p>
            </div>
            <span className="text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
              View guide
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {guide.rating.toFixed(1)} ({guide.reviewCount} reviews)
          </p>
        </div>
      </article>
    </Link>
  );
}
