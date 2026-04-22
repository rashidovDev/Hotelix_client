"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { CalendarDays, CircleAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { CANCEL_BOOKING } from "@/lib/graphql/mutations";
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";
import { routes } from "@/config/routes";
import { BookingEntity, BookingStatus } from "@/types";
import BookingCard from "@/components/dashboard/BookingCard";

interface MyBookingsResponse {
  myBookings: BookingEntity[];
}

interface CancelBookingResponse {
  cancelBooking: {
    id: string;
    status: BookingStatus;
  };
}

export default function BookingPage() {
  const user = useAuthStore((state) => state.user);
  const { data, loading, refetch } = useQuery<MyBookingsResponse>(GET_MY_BOOKINGS);
  const [cancelBookingMutation, { loading: cancelLoading }] = useMutation<CancelBookingResponse>(CANCEL_BOOKING);

  const bookings = useMemo(() => data?.myBookings ?? [], [data]);

  const handleCancel = async (bookingId: string) => {
    await cancelBookingMutation({ variables: { id: bookingId } });
    await refetch();
  };

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <CircleAlert className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to view bookings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your reservations will appear here after you sign in and complete a booking.
        </p>
        <Link
          href={routes.login}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reservations</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">My bookings</h1>
        <p className="mt-2 text-sm text-slate-600">Review confirmed stays, pending reservations, and cancellations.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No bookings yet</h2>
          <p className="mt-2 text-sm text-slate-600">Book a room from any hotel page and it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white px-4 sm:px-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="space-y-3">
              <BookingCard booking={booking} compact />
              {booking.status !== BookingStatus.Cancelled && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancelLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}