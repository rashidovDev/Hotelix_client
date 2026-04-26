"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HotelEntity } from "@/types";
import { Heart, Star } from "lucide-react";
import { routes } from "@/config/routes";
import { useMutation, useQuery } from "@apollo/client/react";
import { IS_SUBSCRIBED, GET_ROOMS_BY_HOTEL } from "@/lib/graphql/queries";
import { SUBSCRIBE_TO_HOTEL, UNSUBSCRIBE_FROM_HOTEL } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import { RoomEntity } from "@/types";

interface IsSubscribedResponse {
  isSubscribed: boolean;
}

interface GetRoomsByHotelResponse {
  findRoomsByHotel: RoomEntity[];
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

  const { data: roomsData } = useQuery<GetRoomsByHotelResponse>(GET_ROOMS_BY_HOTEL, {
    variables: { hotelId: hotel.id },
  });

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

  const rooms = roomsData?.findRoomsByHotel || [];
  const minPrice = rooms.length > 0 ? Math.min(...rooms.map(room => room.price)) : null;
  const formattedPrice = minPrice ? `${Math.round(minPrice).toLocaleString()} USD` : "Price unavailable";

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
    <article className="group relative flex flex-col h-full flex-none snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-64 md:w-72 lg:w-80 min-h-64 sm:min-h-80 md:min-h-96 lg:min-h-95">
      <Link
        href={routes.hotel(hotel.id)}
        className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
      >
        <div className="relative h-32 sm:h-36 md:h-40 bg-slate-100 overflow-hidden">
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

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{hotel.city}</p>

          <h3 className="mt-2 line-clamp-2 text-sm sm:text-base font-semibold text-slate-900">
            {hotel.name}
          </h3>

          <div className="absolute bottom-18 mt-auto pt-3 space-y-2">
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

      <div className="border-t px-4 sm:px-5 py-2 sm:py-3">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-[10px] sm:text-base font-bold text-slate-900">
           {formattedPrice}
          </span>
          {rating && rating >= 9.4 ? (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {minPrice ? Math.round(minPrice * 1.11).toLocaleString() : "401,990"}
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