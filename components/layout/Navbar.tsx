"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  CalendarDays,
  Building2,
  LayoutDashboard,
  LogOut,
  Star,
  User,
  X,
} from "lucide-react";

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

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const links = useMemo(
    () =>
      user?.role === "HOST" || user?.role === "ADMIN"
        ? hostLinks
        : guestLinks,
    [user?.role]
  );

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.trim() || "U";

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [profileMenuOpen]);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [user?.id]);

  const closeProfileMenu = () => setProfileMenuOpen(false);

  return (
    <>
    <nav className="w-full mt-2 bg-transparent px-10 py-4 flex items-center justify-between relative z-20">
      {/* Logo */}
      <div className="flex  justify-center">

      <Link href={routes.home} className="text-3xl font-bold text-white drop-shadow-md">
        {siteConfig.name}
      </Link>

      {/* Center Links */}
    <div className="mt-1.5 ml-5">

        {/* <Link href={routes.destinations} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Destinations
        </Link> */}
          {/* <Link href={routes.about} className="text-white font-extralight  text-lg drop-shadow px-4 mx-1 hover:text-gray-200">
          Tours
        </Link> */}
        <Link href={routes.guides} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Hosts
        </Link>
        <Link href={routes.hotels} className="text-white  font-extralight text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
         Hotels
        </Link>
        {/* <Link href={routes.guides} className="text-white  font-extralight text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
         Rent Car
        </Link> */}

        <Link href={routes.about} className="text-white font-extralight text-lg drop-shadow px-4 mx-1 hover:text-gray-200">
          About Us
        </Link>
        
        <Link href={routes.contact} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Contact Us
        </Link>
        

    </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 transparent  px-7 py-2 rounded-md">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => setProfileMenuOpen((current) => !current)}
              className="flex items-center cursor-pointer gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-left text-white shadow-sm backdrop-blur-sm transition hover:bg-white/15"
              aria-haspopup="dialog"
              aria-expanded={profileMenuOpen}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-900">
                {initials}
              </span>
              <span className="hidden max-w-36 flex-col leading-tight sm:flex">
                <span className="truncate text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                {/* <span className="truncate text-xs text-white/70">Profile menu</span> */}
              </span>
            </button>
          </>
        ) : (
          <>
            <Link
              href={routes.login}
              className="text-white drop-shadow hover:text-gray-200"
            >
              Login
            </Link>
            <Link
              href={routes.register}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 drop-shadow"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
    {isAuthenticated && profileMenuOpen ? (
      <div
        className="fixed inset-0 z-40 flex items-start justify-end bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
        onClick={closeProfileMenu}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Profile menu"
          className="mt-20 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                {initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeProfileMenu}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close profile menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-1">
              {links.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeProfileMenu}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => {
                  closeProfileMenu();
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}