"use client";

import { useQuery } from "@apollo/client/react";
import { format, differenceInCalendarDays } from "date-fns";
import { Calendar, MapPin, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { GET_HOTEL, GET_ROOM } from "@/lib/graphql/queries";
import { BookingEntity, BookingStatus, HotelEntity, RoomEntity } from "@/types";

interface GetRoomResponse {
  findRoom: RoomEntity;
}

interface GetHotelResponse {
  findHotel: HotelEntity;
}

interface BookingCardProps {
  booking: BookingEntity;
  compact?: boolean;
}

export default function BookingCard({ booking, compact = false }: BookingCardProps) {
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = differenceInCalendarDays(checkOutDate, checkInDate);

  const { data: roomData, loading: roomLoading } = useQuery<GetRoomResponse>(GET_ROOM, {
    variables: { id: booking.roomId },
    skip: !booking.roomId,
    fetchPolicy: "cache-first",
  });

  const room = roomData?.findRoom;

  const { data: hotelData, loading: hotelLoading } = useQuery<GetHotelResponse>(GET_HOTEL, {
    variables: { id: room?.hotelId || "" },
    skip: !room?.hotelId,
    fetchPolicy: "cache-first",
  });

  const hotel = hotelData?.findHotel;
  const hotelImage = hotel?.images?.[0] || "/hotel.jpg";
  const hotelName = hotel?.name || "Hotel";
  const city = hotel?.city || "Unknown city";
  const country = hotel?.country || "Unknown country";
  const roomName = room?.name || `Room ${booking.roomId.slice(0, 8)}`;
  const rating = hotel?.rating || 0;

  const statusConfig = {
    CONFIRMED: {
      icon: CheckCircle,
      label: "Confirmed",
      color: "bg-emerald-100 text-emerald-700",
      iconColor: "text-emerald-600",
    },
    PENDING: {
      icon: Clock,
      label: "Pending",
      color: "bg-amber-100 text-amber-700",
      iconColor: "text-amber-600",
    },
    CANCELLED: {
      icon: XCircle,
      label: "Cancelled",
      color: "bg-red-100 text-red-700",
      iconColor: "text-red-600",
    },
  };

  const currentStatus = statusConfig[booking.status];
  const StatusIcon = currentStatus.icon;

  if (roomLoading || hotelLoading) {
    return compact ? (
      <article className="flex flex-col gap-4 border-b border-slate-200 py-4">
        <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200" />
        <div className="space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </article>
    ) : (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-48 animate-pulse bg-slate-200 sm:h-56" />
        <div className="space-y-4 p-4 sm:p-5">
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </article>
    );
  }

  if (compact) {
    return (
      <article className="flex flex-col gap-4 border-b border-slate-200 py-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-32 sm:flex-none">
          <img
            src={hotelImage}
            alt={hotelName}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className={`absolute right-2 top-2 flex items-center gap-1 rounded-full ${currentStatus.color} px-2.5 py-1`}>
            <StatusIcon className={`h-3.5 w-3.5 ${currentStatus.iconColor}`} />
            <span className="text-[10px] font-semibold">{currentStatus.label}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{hotelName}</h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{city}, {country}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-700">{roomName}</span>
            <span>{format(checkInDate, "MMM d")} - {format(checkOutDate, "MMM d, yyyy")}</span>
            <span className="font-semibold text-slate-900">${booking.totalPrice.toFixed(2)}</span>
          </div>

          <div className="text-xs text-slate-500">Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-56">
        <img
          src={hotelImage}
          alt={hotelName}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Status Badge */}
        <div className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full ${currentStatus.color} px-3 py-1.5`}>
          <StatusIcon className={`h-4 w-4 ${currentStatus.iconColor}`} />
          <span className="text-xs font-semibold">{currentStatus.label}</span>
        </div>
        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-md">
            <span className="text-sm font-bold text-slate-900">{rating}</span>
            <span className="text-xs text-slate-600">★</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-4 p-4 sm:p-5">
        {/* Hotel & Location */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{hotelName}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{city}, {country}</span>
          </div>
        </div>

        {/* Room Name */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Room</p>
          <p className="text-sm font-medium text-slate-900">{roomName}</p>
        </div>

        {/* Dates and Duration */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-in</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">
                {format(checkInDate, "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-out</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">
                {format(checkOutDate, "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <Users className="h-4 w-4 text-slate-600" />
          <span className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{Math.max(nights, 1)}</span> night{nights !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Price Section */}
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-slate-600">Total Price</span>
            <span className="text-2xl font-bold text-slate-900">
              ${booking.totalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ${(booking.totalPrice / Math.max(nights, 1)).toFixed(2)} per night
          </p>
        </div>

        {/* Booking Date */}
        <div className="text-xs text-slate-500">
          Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}
        </div>
      </div>
    </article>
  );
}
