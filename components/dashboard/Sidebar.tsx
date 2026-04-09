"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Star,
  Building2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const guestLinks = [
  { label: "Overview", href: routes.dashboard, icon: LayoutDashboard },
  { label: "My Bookings", href: routes.dashboardBookings, icon: CalendarDays },
  { label: "My Reviews", href: routes.dashboardReviews, icon: Star },
  { label: "Profile", href: routes.dashboardProfile, icon: User },
];

const hostLinks = [
  { label: "Overview", href: routes.dashboard, icon: LayoutDashboard },
  { label: "My Bookings", href: routes.dashboardBookings, icon: CalendarDays },
  { label: "My Hotels", href: routes.dashboardHotels, icon: Building2 },
  { label: "My Reviews", href: routes.dashboardReviews, icon: Star },
  { label: "Profile", href: routes.dashboardProfile, icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const links =
    user?.role === "HOST" || user?.role === "ADMIN" ? hostLinks : guestLinks;

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}