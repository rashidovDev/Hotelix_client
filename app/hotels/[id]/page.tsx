"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import GalleryGrid from "@/components/hotels/details/GalleryGrid";
import HotelHeader from "@/components/hotels/details/HotelHeader";
import OverviewSection from "@/components/hotels/details/OverviewSection";
import ReviewsSection from "@/components/hotels/details/ReviewsSection";
import RoomCard, { RoomItem } from "@/components/hotels/details/RoomCard";
import Tabs from "@/components/hotels/details/Tabs";
import Navbar from "@/components/layout/Navbar";
import { GET_HOTEL, GET_ROOMS_BY_HOTEL, GET_USER } from "@/lib/graphql/queries";
import { HotelEntity, UserEntity } from "@/types";

const tabItems = ["Overview", "Rooms", "Amenities", "Policies"] as const;
type HotelTab = (typeof tabItems)[number];

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

interface GetHotelResponse {
  findHotel: HotelEntity;
}

interface GetUserResponse {
  findUser: UserEntity;
}

interface GetRoomsResponse {
  findRoomsByHotel: Room[];
}

const reviewItems = [
  {
    title: "Great stay in the city center",
    author: "Lina M.",
    description:
      "The room was spotless and the staff was helpful throughout our visit.",
    pros: ["Excellent location", "Fast check-in", "Comfortable bed"],
    score: 9.6,
    date: "Apr 2026",
  },
  {
    title: "Very convenient for short trips",
    author: "David K.",
    description:
      "Close to metro and restaurants. Breakfast options were better than expected.",
    pros: ["Quiet at night", "Good breakfast", "Friendly reception"],
    score: 8.4,
    date: "Mar 2026",
  },
];

function mapRoomToRoomItem(room: Room): RoomItem {
  return {
    name: room.name,
    image: room.images?.[0] || "/hotel.jpg",
    size: "N/A",
    capacity: `${room.capacity} people`,
    bedType: room.type,
    policy: room.description || "Non-refundable",
    price: room.price,
  };
}

export default function HotelDetailsPage() {
  const params = useParams();
  const hotelId = params.id as string;
  const [activeTab, setActiveTab] = useState<HotelTab>("Overview");

  // Fetch hotel details
  const { data: hotelData, loading: hotelLoading } = useQuery<GetHotelResponse>(
    GET_HOTEL,
    {
      variables: { id: hotelId },
      skip: !hotelId,
    }
  );

  // Fetch rooms for this hotel
  const { data: roomsData, loading: roomsLoading } = useQuery<GetRoomsResponse>(
    GET_ROOMS_BY_HOTEL,
    {
      variables: { hotelId },
      skip: !hotelId,
    }
  );

  const hotel = hotelData?.findHotel;

  const { data: hostData, loading: hostLoading } = useQuery<GetUserResponse>(GET_USER, {
    variables: { id: hotel?.ownerId },
    skip: !hotel?.ownerId,
  });

  const host = hostData?.findUser;
  const rooms = useMemo(
    () => roomsData?.findRoomsByHotel?.map(mapRoomToRoomItem) ?? [],
    [roomsData]
  );

  const galleryImages = useMemo(
    () => hotel?.images || ["/hotel.jpg"],
    [hotel?.images]
  );

  const tabContent = useMemo(() => {
    if (activeTab === "Overview") return <OverviewSection />;

    if (activeTab === "Rooms") {
      return (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Rooms</h2>
          {roomsLoading ? (
            <p className="text-sm text-slate-600">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No rooms available for this hotel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {rooms.map((room: RoomItem) => (
                <RoomCard key={room.name} room={room} />
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activeTab === "Amenities") {
      return (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
          {hotel?.amenities && hotel.amenities.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:grid-cols-3">
              {hotel.amenities.map((amenity: string) => (
                <li key={amenity} className="flex items-center gap-2">
                  <span>✓</span> {amenity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No amenities listed</p>
          )}
        </section>
      );
    }

    return (
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h2 className="text-xl font-semibold text-slate-900">Policies</h2>
        <p>Check-in: from 15:00</p>
        <p>Check-out: until 11:00</p>
        <p>Cancellation: Non-refundable options available</p>
      </section>
    );
  }, [activeTab, hotelLoading, roomsLoading, rooms, hotel?.amenities]);

  if (hotelLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <p className="text-sm text-slate-600">Loading hotel details...</p>
        </div>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <p className="text-sm text-slate-600">Hotel not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className="relative min-h-[34vh] overflow-hidden"
        style={{
          backgroundImage: `url('${galleryImages[0]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/35" />

        <div className="relative z-10">
          <Navbar />

          <div className="mx-auto w-full px-4 pb-10 pt-8 sm:px-6 lg:w-[80%] lg:px-0">
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl">
              {hotel.name}
            </h1>
            <p className="mt-2 text-sm text-sky-50 sm:text-base">
              {hotel.location}, {hotel.city}, {hotel.country}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:w-[80%] lg:px-0">
        <HotelHeader
          name={hotel.name}
          subtitle={hotel.description || `Located in ${hotel.city}, ${hotel.country}`}
          score={hotel.rating ? Number(hotel.rating) : 8.5}
          reviewsCount={`${Math.floor(Math.random() * 1000) + 300} reviews`}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Host profile</h2>

          {hostLoading ? (
            <p className="mt-3 text-sm text-slate-600">Loading host profile...</p>
          ) : host ? (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {host.avatar ? (
                  <img
                    src={host.avatar}
                    alt={`${host.firstName} ${host.lastName}`}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-700">
                    {host.firstName[0]}
                    {host.lastName[0]}
                  </div>
                )}

                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {host.firstName} {host.lastName}
                  </p>
                  <p className="text-sm text-slate-600">{host.email}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Host since {new Date(host.createdAt).getFullYear()}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Host information is unavailable.</p>
          )}
        </section>

        <GalleryGrid images={galleryImages} hotelName={hotel.name} />

        <Tabs tabs={[...tabItems]} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as HotelTab)} />

        {tabContent}

        <ReviewsSection reviews={reviewItems} />
      </div>
    </main>
  );
}
