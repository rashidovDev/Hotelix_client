import Link from "next/link";
import { routes } from "@/config/routes";

export interface HotelListItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  roomType: string;
  bedType: string;
  bathroom: string;
  price: number;
  tags: string[];
  dealTags: string[];
  subscriptionCount?: number;
}

interface HotelCardProps {
  hotel: HotelListItem;
  isSubscribed?: boolean;
  onFollow?: () => void;
  followLoading?: boolean;
}

export default function HotelCard({
  hotel,
  isSubscribed,
  onFollow,
  followLoading = false,
}: HotelCardProps) {
  const ratingLabel = hotel.rating >= 9 ? "Excellent" : "Very good";
  const ratingClass =
    ratingLabel === "Excellent"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md transition hover:shadow-xl sm:flex-row sm:items-stretch">
      <div className="h-52 w-full overflow-hidden rounded-lg bg-slate-100 sm:h-auto sm:w-50 sm:flex-none">
        <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">{hotel.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{hotel.distance}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 text-sm text-slate-700">
            <p className="font-semibold">{hotel.roomType}</p>
            <p>{hotel.bedType}</p>
            <p>{hotel.bathroom}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {hotel.dealTags.map((dealTag) => (
              <span
                key={dealTag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {dealTag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-end justify-between gap-3 border-t border-slate-100 pt-3 sm:w-55 sm:flex-col sm:items-end sm:justify-between sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <div className="text-right">
          <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${ratingClass}`}>
            {ratingLabel} {hotel.rating.toFixed(1)}
          </div>
          <p className="mt-1 text-xs text-slate-500">{hotel.reviews} reviews</p>
          {isSubscribed === false && onFollow ? (
            <button
              type="button"
              onClick={onFollow}
              disabled={followLoading}
              className="mt-2 inline-flex rounded-full border 
              border-blue-500 hover:bg-blue-500 px-3 py-1 text-xs font-semibold
               hover:text-white transition disabled:opacity-60 text-blue-500"
            >
              {followLoading ? "Following..." : "Follow"}
            </button>
          ) : hotel.subscriptionCount !== undefined ? (
            <p className="mt-1 text-xs text-slate-500"> {hotel.subscriptionCount} followers</p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">${hotel.price}</p>
          <p className="mt-1 text-xs text-slate-500">1 night, 2 guests</p>
          <Link
            href={routes.hotel(hotel.id)}
            className="mt-3 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            See booking options
          </Link>
        </div>
      </div>
    </article>
  );
}
