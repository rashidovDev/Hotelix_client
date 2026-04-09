"use client";

import { useQuery } from "@apollo/client/react";
import { useAuthStore } from "@/store/authStore";
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";
import { BookingEntity, BookingStatus } from "@/types";
import StatsCard from "@/components/dashboard/StatsCard";
import { CalendarDays, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { format } from "date-fns";

interface MyBookingsResponse {
  myBookings: BookingEntity[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, loading } = useQuery<MyBookingsResponse>(GET_MY_BOOKINGS);

  const bookings = data?.myBookings || [];

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b) => b.status === BookingStatus.Pending
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === BookingStatus.Confirmed
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === BookingStatus.Cancelled
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon={CalendarDays}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={pendingBookings}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Confirmed"
          value={confirmedBookings}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Cancelled"
          value={cancelledBookings}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <Link
            href={routes.dashboardBookings}
            className="text-blue-600 text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No bookings yet</p>
            <Link
              href={routes.search}
              className="text-blue-600 text-sm hover:underline mt-1 inline-block"
            >
              Find a hotel
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-800">
                    Booking #{booking.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(booking.checkIn), "MMM dd")} →{" "}
                    {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-gray-800">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                      ${booking.status === BookingStatus.Confirmed
                        ? "bg-green-100 text-green-600"
                        : booking.status === BookingStatus.Pending
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}