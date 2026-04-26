"use client";

import { Calendar, MapPin, DollarSign, CheckCircle2, Zap, Award, Heart, Clock, BookOpen, CreditCard, User } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile Header */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 md:mx-0 -mt-4 sm:-mt-6 md:-mt-8 md:mt-0 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-linear-to-r from-blue-500 to-blue-600 rounded-b-3xl p-6 sm:p-8 text-white shadow-lg">
          <div className="relative flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-700 flex items-center justify-center border-4 border-white shadow-lg text-2xl sm:text-3xl font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome back, {user?.firstName || "Traveler"}! 👋</h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base lg:text-lg">Track your bookings, manage reservations, and explore more.</p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Your Overview</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Bookings"
            value="12"
            icon={Calendar}
            color="blue"
          />
          <StatsCard
            title="Upcoming Trips"
            value="3"
            icon={MapPin}
            color="green"
          />
          <StatsCard
            title="Total Spent"
            value="$4,250"
            icon={DollarSign}
            color="yellow"
          />
          <StatsCard
            title="Completed Stays"
            value="9"
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="Loyalty Points"
            value="1,240"
            icon={Zap}
            color="yellow"
          />
          <StatsCard
            title="Average Rating"
            value="4.8 ⭐"
            icon={Award}
            color="blue"
          />
          <StatsCard
            title="Favorite Hotels"
            value="7"
            icon={Heart}
            color="red"
          />
          <StatsCard
            title="Days Traveled"
            value="45"
            icon={Clock}
            color="green"
          />
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow hover:border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bookings</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">Track every stay</p>
            <p className="mt-1 text-sm text-slate-600">View confirmed, pending, and cancelled reservations.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow hover:border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trips</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">Plan ahead</p>
            <p className="mt-1 text-sm text-slate-600">See upcoming dates and your latest booking activity.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow hover:border-purple-200 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">Manage account</p>
            <p className="mt-1 text-sm text-slate-600">Update your profile, avatar, and account details anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}