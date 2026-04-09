"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  return (
    <nav className="w-full mt-2 bg-transparent px-10 py-4 flex items-center justify-between relative z-20">
      {/* Logo */}
      <div className="flex  justify-center">

      <Link href={routes.home} className="text-3xl font-bold text-white drop-shadow-md">
        {siteConfig.name}
      </Link>

      {/* Center Links */}
    <div className="mt-1.5 ml-5">

      <Link href={routes.destinations} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Destinations
        </Link>
          <Link href={routes.about} className="text-white font-extralight  text-lg drop-shadow px-4 mx-1 hover:text-gray-200">
          Tours
        </Link>
        <Link href={routes.guides} className="text-white  font-extralight text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
         Hotels
        </Link>
        <Link href={routes.guides} className="text-white  font-extralight text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
         Rent Car
        </Link>

        <Link href={routes.about} className="text-white font-extralight text-lg drop-shadow px-4 mx-1 hover:text-gray-200">
          About Us
        </Link>
        <Link href={routes.guides} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Guides
        </Link>
        <Link href={routes.contact} className="text-white font-extralight  text-lg px-4 mx-1 drop-shadow hover:text-gray-200">
          Contact Us
        </Link>
        

    </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              href={routes.dashboard}
              className="text-white drop-shadow hover:text-gray-200"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 drop-shadow"
            >
              Logout
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
  );
}