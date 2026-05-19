"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Building2, Users, Heart } from "lucide-react";
import { routes } from "@/config/routes";
import { GET_ALL_HOTELS, GET_USER } from "@/lib/graphql/queries";
import { HotelEntity, UserEntity } from "@/types";

interface GetAllHotelsResponse {
  findAllHotels: HotelEntity[];
}

interface GetUserResponse {
  findUser: UserEntity;
}

type HostItem = {
  id: string;
  hotelCount: number;
  hotelName: string;
  country: string;
};

function getRandomFollowers(id: string): number {
  // Create a deterministic random number based on the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 3 + (Math.abs(hash) % 8);
}

function HostCard({ host }: { host: HostItem }) {
  const { data, loading } = useQuery<GetUserResponse>(GET_USER, {
    variables: { id: host.id },
    fetchPolicy: "cache-first",
  });
  const [isFollowing, setIsFollowing] = useState(false);

  const user = data?.findUser;
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : `Host ${host.id.slice(0, 6)}`;
  const initials = `${user?.firstName?.[0] || "H"}${user?.lastName?.[0] || ""}`.trim();
  const followers = getRandomFollowers(host.id);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <article className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)] flex flex-col h-full">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col flex-1">
        <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-slate-100">
          {loading ? (
            <div className="h-full w-full animate-pulse bg-slate-200" />
          ) : user?.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-5xl font-bold text-white">
              {initials}
            </div>
          )}
          <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
        </div>

        <div className="flex flex-col flex-1 space-y-3 p-4 sm:p-5">
          <div className="space-y-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Host</p>
            <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
            <p className="text-xs text-slate-600">{host.country || "Global host"}</p>
          </div>

          <div className="flex gap-3 justify-center w-full">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{followers}</p>
              <p className="text-xs text-slate-600">Followers</p>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{host.hotelCount}</p>
              <p className="text-xs text-slate-600">Hotels</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-700 line-clamp-2">
            <p>
              <span className="font-semibold text-slate-900">Top stay:</span> {host.hotelName || "No hotels yet"}
            </p>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleFollow}
              className={`flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition inline-flex gap-1 ${
                isFollowing
                  ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={isFollowing ? "currentColor" : "none"} />
              {isFollowing ? "Following" : "Follow"}
            </button>
            <Link
              href={`${routes.hotels}?ownerId=${encodeURIComponent(host.id)}`}
              className="flex-1 bg-blue-500 text-white items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-blue-700 inline-flex"
            >
              See hotels
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedGuides() {
  const { data: hotelsData, loading } = useQuery<GetAllHotelsResponse>(GET_ALL_HOTELS);

  const hosts = useMemo<HostItem[]>(() => {
    const hotels = hotelsData?.findAllHotels ?? [];
    const hostsById = new Map<string, HostItem>();

    for (const hotel of hotels) {
      const current = hostsById.get(hotel.ownerId);

      if (!current) {
        hostsById.set(hotel.ownerId, {
          id: hotel.ownerId,
          hotelCount: 1,
          hotelName: hotel.name,
          country: hotel.country,
        });
        continue;
      }

      hostsById.set(hotel.ownerId, {
        ...current,
        hotelCount: current.hotelCount + 1,
        hotelName: current.hotelName || hotel.name,
        country: current.country || hotel.country,
      });
    }

    return Array.from(hostsById.values()).sort(
      (left, right) => right.hotelCount - left.hotelCount || left.id.localeCompare(right.id)
    );
  }, [hotelsData]);

  return (
    <section className="w-full bg-slate-50">
      <div className="mx-auto w-full px-4 py-14 sm:px-6 lg:w-[80%] lg:px-0">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              <Users className="h-3.5 w-3.5" />
              Hosts
            </div> */}
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet our hosts
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Browse every host on the platform and see how many hotels each one manages.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <Building2 className="h-4 w-4 text-blue-600" />
            {hosts.length} hosts, {hosts.reduce((sum, host) => sum + host.hotelCount, 0)} hotels
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-90 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : hosts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {hosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No hosts found yet.
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href={routes.guides}
            className="inline-flex items-center rounded-xl border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-600"
          >
            View all Hosts
          </Link>
        </div>
      </div>
    </section>
  );
}
