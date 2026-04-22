"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CalendarDays, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/store/authStore";
import { useBooking } from "@/hooks/useBooking";
import { RoomEntity } from "@/types";

interface RoomBookingPanelProps {
  room: RoomEntity;
  hotelName?: string;
  hotelLocation?: string;
}

type AvailabilityState = "idle" | "checking" | "available" | "unavailable" | "invalid";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function toDateTimeValue(value: string) {
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export default function RoomBookingPanel({ room, hotelName, hotelLocation }: RoomBookingPanelProps) {
  const user = useAuthStore((state) => state.user);
  const {
    selectedRoom,
    checkIn,
    checkOut,
    guests,
    bookingLoading,
    checkingAvailability,
    setCheckIn,
    setCheckOut,
    setGuests,
    setSelectedRoom,
    calculateTotalPrice,
    checkRoomAvailability,
    createBooking,
    clearBooking,
  } = useBooking();

  const [checkInValue, setCheckInValue] = useState("");
  const [checkOutValue, setCheckOutValue] = useState("");
  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>("idle");

  const nights = useMemo(() => {
    if (!checkInValue || !checkOutValue) return 0;

    return Math.max(0, differenceInCalendarDays(parseISO(checkOutValue), parseISO(checkInValue)));
  }, [checkInValue, checkOutValue]);

  useEffect(() => {
    setSelectedRoom(room);

    return () => {
      clearBooking();
    };
  }, [room, clearBooking, setSelectedRoom]);

  useEffect(() => {
    setCheckIn(checkInValue ? toDateTimeValue(checkInValue) : null);
    setCheckOut(checkOutValue ? toDateTimeValue(checkOutValue) : null);
    setAvailabilityState("idle");
  }, [checkInValue, checkOutValue, setCheckIn, setCheckOut]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice, checkIn, checkOut, selectedRoom]);

  const bookingTotal = nights > 0 ? nights * room.price : 0;

  const handleCheckAvailability = async () => {
    if (!checkInValue || !checkOutValue || nights <= 0) {
      setAvailabilityState("invalid");
      return false;
    }

    setAvailabilityState("checking");
    const available = await checkRoomAvailability();
    setAvailabilityState(available ? "available" : "unavailable");
    return available;
  };

  const handleBookNow = async () => {
    if (!user) return;

    const available = availabilityState === "available" ? true : await handleCheckAvailability();
    if (!available) return;

    await createBooking();
  };

  const canReserve = Boolean(user) && selectedRoom && nights > 0 && availabilityState === "available";

  return (
    <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reserve</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{room.name}</h2>
          </div>
          <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{formatCurrency(room.price)}</div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          <span>Up to {room.capacity} guests</span>
        </div>

        {hotelName ? (
          <p className="text-sm text-slate-600">
            Staying at <span className="font-semibold text-slate-900">{hotelName}</span>
            {hotelLocation ? <span> in {hotelLocation}</span> : null}
          </p>
        ) : null}
      </div>

      {room.images?.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {room.images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${room.name} photo ${index + 1}`}
              className="h-28 w-full rounded-2xl object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-32"
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays className="h-4 w-4 text-slate-400" /> Check in
          </span>
          <input
            type="date"
            value={checkInValue}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(event) => setCheckInValue(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays className="h-4 w-4 text-slate-400" /> Check out
          </span>
          <input
            type="date"
            value={checkOutValue}
            min={checkInValue || format(new Date(), "yyyy-MM-dd")}
            onChange={(event) => setCheckOutValue(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="h-4 w-4 text-slate-400" /> Guests
        </span>
        <select
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        >
          {Array.from({ length: room.capacity }, (_, index) => index + 1).map((guestCount) => (
            <option key={guestCount} value={guestCount}>
              {guestCount} guest{guestCount === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        {nights > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>{nights} night{nights === 1 ? "" : "s"}</span>
            <span className="font-semibold text-slate-900">{formatCurrency(bookingTotal)}</span>
          </div>
        ) : (
          <p>Select your dates to see the nightly total.</p>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
          <p>Free cancellation until 48 hours before check-in. Confirmation is instant after booking.</p>
        </div>
      </div>

      {availabilityState === "available" ? (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Room available for those dates.
        </div>
      ) : availabilityState === "unavailable" ? (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          This room is already booked for the selected dates.
        </div>
      ) : availabilityState === "invalid" ? (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Choose a valid stay length before checking availability.
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Check availability before confirming your booking.
        </div>
      )}

      {!user ? (
        <Link
          href={routes.login}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Sign in to reserve
        </Link>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={checkingAvailability || !checkInValue || !checkOutValue}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkingAvailability ? "Checking..." : "Check availability"}
          </button>

          <button
            type="button"
            onClick={handleBookNow}
            disabled={!canReserve || bookingLoading}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {bookingLoading ? "Booking..." : "Reserve room"}
          </button>
        </div>
      )}

      <p className="text-xs text-slate-500">
        {selectedRoom ? "Selected room is locked into the current reservation." : "No room selected yet."}
      </p>
    </aside>
  );
}