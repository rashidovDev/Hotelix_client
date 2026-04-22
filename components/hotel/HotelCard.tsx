"use client";

import Link from "next/link";
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

    if (!isAuthenticated || likeLoading) {
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
    <article className="group relative h-95 w-[18rem] flex-none snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:w-[20rem]">
      <Link
        href={routes.hotel(hotel.id)}
        className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
      >
        <div className="relative h-48 bg-slate-100">
          {hotel.images?.[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50">
              <span className="text-4xl">🏨</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500">{hotel.city}</p>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900">
            {hotel.name}
          </h3>

          <div className="mt-1 flex items-center gap-0.5 text-yellow-400">
            {Array.from({ length: stars }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">
              {rating ? `${rating} / 10` : "9.6 / 10"}
            </span>
            <span className="text-sm text-gray-500">
              {hotel.amenities?.length
                ? `${(hotel.amenities.length * 1832).toLocaleString()} reviews`
                : "5,498 reviews"}
            </span>
          </div>

          <div className="mt-3 absolute bottom-5">
            <span className="text-lg font-semibold text-slate-900">
              From KRW 362,390
            </span>
            {rating && rating >= 9.4 ? (
              <span className="ml-2 text-sm text-gray-400 line-through">
                KRW 401,990
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={handleLikeClick}
        disabled={!isAuthenticated || likeLoading}
        className={`absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 ${
          isSubscribed ? "text-rose-500" : "text-slate-600 hover:text-rose-500"
        }`}
      >
        <Heart className={`h-4 w-4 ${isSubscribed ? "fill-current" : ""}`} />
      </button>
    </article>
  );
}