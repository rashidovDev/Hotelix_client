"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Building2, Users } from "lucide-react";
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

function HostCard({ host }: { host: HostItem }) {
  const { data, loading } = useQuery<GetUserResponse>(GET_USER, {
    variables: { id: host.id },
    fetchPolicy: "cache-first",
  });

  const user = data?.findUser;
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : `Host ${host.id.slice(0, 6)}`;
  const initials = `${user?.firstName?.[0] || "H"}${user?.lastName?.[0] || ""}`.trim();

  return (
    <article className="relative group overflow-hidden rounded-3xl border border-slate-200
     bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]">
      <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-slate-50">
        <div className="h-56 w-full flex justify-center items-center overflow-hidden bg-slate-100 sm:h-64">
          {loading ? (
            <div className="h-32 w-32 rounded-full animate-pulse bg-slate-200" />
          ) : user?.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="h-56 w-56 rounded-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-3xl font-bold text-white">
              {initials}
            </div>
          )}
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Host</p>
            <h3 className="text-2xl font-bold text-slate-900">{fullName}</h3>
            <p className="text-sm text-slate-600">{host.country || "Global host"}</p>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Hotels:</span> {host.hotelCount}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Top stay:</span> {host.hotelName || "No hotels yet"}
            </p>
          </div>

          <Link
            href={`${routes.hotels}?ownerId=${encodeURIComponent(host.id)}`}
            className=" inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            See hotels
          </Link>
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-90 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : hosts.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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
