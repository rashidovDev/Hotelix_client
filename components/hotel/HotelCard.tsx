import Link from "next/link";
import { HotelEntity } from "@/types";
import { MapPin, Star } from "lucide-react";
import { routes } from "@/config/routes";

export default function HotelCard({ hotel }: { hotel: HotelEntity }) {
  const rating = hotel.rating ? Number(hotel.rating.toFixed(1)) : null;

  return (
    <Link href={routes.hotel(hotel.id)} className="group block">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]">
        <div className="relative h-52 bg-slate-100">
          {hotel.images?.[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50">
              <span className="text-4xl">🏨</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/45 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {hotel.city}
          </div>

          {rating ? (
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white">
              <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              {rating}
            </div>
          ) : null}
        </div>

        <div className="space-y-3 p-4">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {hotel.location}, {hotel.country}
            </span>
          </div>

          {rating ? (
            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <Star className="h-3.5 w-3.5 fill-current" />
              Guest rating {rating}
            </div>
          ) : (
            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
              New listing
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {hotel.amenities?.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities?.length > 3 ? (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                +{hotel.amenities.length - 3} more
              </span>
            ) : null}
          </div>

          <div className="pt-1 text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
            View details
          </div>
        </div>
      </article>
    </Link>
  );
}