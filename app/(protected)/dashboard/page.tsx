"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const firstName = useAuthStore((state) => state.user?.firstName);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your bookings
        </p>
      </div>
    </div>
  );
}