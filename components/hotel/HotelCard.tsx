"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HotelEntity } from "@/types";
import { Heart, Star } from "lucide-react";
import { routes } from "@/config/routes";
import { useMutation, useQuery } from "@apollo/client/react";
import { IS_SUBSCRIBED } from "@/lib/graphql/queries";
import { SUBSCRIBE_TO_HOTEL, UNSUBSCRIBE_FROM_HOTEL } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";

interface IsSubscribedResponse {
  isSubscribed: boolean;
}

interface SubscribeResponse {
  subscribeToHotel: {
    id: string;
    userId: string;
    hotelId: string;
    createdAt: string;
  };
}

interface UnsubscribeResponse {
  unsubscribeFromHotel: boolean;
}

export default function HotelCard({ hotel }: { hotel: HotelEntity }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rating = hotel.rating ? Number(hotel.rating.toFixed(1)) : null;
  const stars = rating ? Math.min(5, Math.max(1, Math.round(rating / 2))) : 5;

  const { data: subscriptionData, loading: subscriptionStateLoading, refetch } =
    useQuery<IsSubscribedResponse>(IS_SUBSCRIBED, {
      variables: { hotelId: hotel.id },
      skip: !isAuthenticated,
    });

  const [subscribeToHotel, { loading: subscribeLoading }] =
    useMutation<SubscribeResponse>(SUBSCRIBE_TO_HOTEL);

  const [unsubscribeFromHotel, { loading: unsubscribeLoading }] =
    useMutation<UnsubscribeResponse>(UNSUBSCRIBE_FROM_HOTEL);

  const isSubscribed = isAuthenticated ? (subscriptionData?.isSubscribed ?? false) : false;
  const likeLoading = subscriptionStateLoading || subscribeLoading || unsubscribeLoading;

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(routes.login);
      return;
    }

    if (likeLoading) {
      return;
    }

    if (isSubscribed) {
      await unsubscribeFromHotel({
        variables: { hotelId: hotel.id },
      });
    } else {
      await subscribeToHotel({
        variables: { hotelId: hotel.id },
      });
    }

    await refetch();
  };

  return (
    <article className="group relative flex flex-col h-full flex-none snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-64 md:w-72 lg:w-80 min-h-80 sm:min-h-[360px] md:min-h-[400px] lg:min-h-[440px]">
      <Link
        href={routes.hotel(hotel.id)}
        className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
      >
        <div className="relative h-40 sm:h-44 md:h-48 bg-slate-100 overflow-hidden">
          {hotel.images?.[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50">
              <span className="text-5xl sm:text-6xl">🏨</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{hotel.city}</p>

          <h3 className="mt-2 line-clamp-2 text-sm sm:text-base font-semibold text-slate-900">
            {hotel.name}
          </h3>

          <div className="mt-auto pt-3 space-y-2">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {Array.from({ length: stars }).map((_, index) => (
                <Star key={index} className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current" />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="rounded-md bg-blue-600 px-2 py-1 font-medium text-white">
                {rating ? `${rating} / 10` : "9.6 / 10"}
              </span>
              <span className="text-gray-500">
                {hotel.amenities?.length
                  ? `${(hotel.amenities.length * 1832).toLocaleString()} reviews`
                  : "5,498 reviews"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="border-t border-slate-100 bg-slate-50/50 px-4 sm:px-5 py-3 sm:py-4">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-slate-900">
            KRW 362,390
          </span>
          {rating && rating >= 9.4 ? (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              KRW 401,990
            </span>
          ) : null}
          <span className="text-xs text-gray-500 ml-auto">per night</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={handleLikeClick}
        disabled={likeLoading}
        className={`absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 ${
          isSubscribed ? "text-rose-500" : "text-slate-600 hover:text-rose-500"
        }`}
      >
        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isSubscribed ? "fill-current" : ""}`} />
      </button>
    </article>
  );
}