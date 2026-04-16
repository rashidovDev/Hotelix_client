"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_HOTELS, GET_ROOMS_BY_HOTEL } from "@/lib/graphql/queries";
import { useAuthStore } from "@/store/authStore";
import { HotelEntity } from "@/types";
import { routes } from "@/config/routes";
import { Settings } from "lucide-react";

interface MyHotelsQueryResponse {
  myHotels: HotelEntity[];
}

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description?: string;
  images?: string[];
  hotelId: string;
}

interface GetRoomsResponse {
  findRoomsByHotel: Room[];
}

export default function HotelPage() {
  const user = useAuthStore((state) => state.user);
  const canCreate = user?.role === "HOST" || user?.role === "ADMIN";

  const { data, loading: hotelsLoading } = useQuery<MyHotelsQueryResponse>(
    GET_MY_HOTELS,
    {
      skip: !user,
      fetchPolicy: "network-only",
    }
  );

  const myHotels = useMemo(() => data?.myHotels ?? [], [data?.myHotels]);

  // Fetch rooms for each hotel
  const { data: roomsDataCollection } = useQuery<GetRoomsResponse>(
    GET_ROOMS_BY_HOTEL,
    {
      variables: { hotelId: myHotels[0]?.id || "" },
      skip: !myHotels.length,
    }
  );

  const getRoomCount = (hotelId: string): number => {
    // This is a simplified approach - you might want to fetch all rooms data at once
    return 0;
  };

  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <div className="flex items-center justify-between rounded-3xl border border-sky-100 bg-linear-to-r from-white via-sky-50 to-cyan-50 px-6 py-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Hotels</h1>
          <p className="mt-2 text-sm text-slate-700">
            View and manage all your existing hotel listings.
          </p>
        </div>
        {canCreate ? (
          <Link
            href={routes.dashboardHotelsNew}
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Add New Hotel
          </Link>
        ) : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Hotel List</h2>

        {hotelsLoading ? (
          <p className="mt-4 text-sm text-slate-600">Loading hotels...</p>
        ) : myHotels.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No hotels yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-44 w-full bg-slate-100">
                  {hotel.images?.[0] ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🏨
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <p className="truncate text-base font-semibold text-slate-900">{hotel.name}</p>
                  <p className="text-sm text-slate-700">
                    {hotel.city}, {hotel.country}
                  </p>
                  <p className="truncate text-xs text-slate-600">{hotel.location}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {hotel.images?.length ?? 0} images
                    </span>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                      {hotel.amenities?.length ?? 0} amenities
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={routes.dashboardHotelRooms(hotel.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                    >
                      <Settings className="h-3 w-3" />
                      Rooms
                    </Link>
                    <Link
                      href={routes.dashboardHotelEdit(hotel.id)}
                      className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}