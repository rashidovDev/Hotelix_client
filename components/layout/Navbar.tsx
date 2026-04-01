"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  return (
    <nav className="w-full mt-2 bg-transparent px-6 py-4 
    flex items-center justify-between relative z-20" style={{ backgroundColor: 'transparent' }}>
      <Link href={routes.home} className="text-2xl font-bold text-white drop-shadow-md">
        {siteConfig.name}
      </Link>

      <div className="bg-transparent border border-white/30 px-4 py-2 rounded-4xl">
        <Link href={routes.search} className="text-white drop-shadow px-3 mx-1 hover:text-gray-200">
          About Us
        </Link>

        <Link href={routes.search} className="text-white px-3 mx-1 drop-shadow hover:text-gray-200">
          Guides
        </Link>

        <Link href={routes.search} className="text-white px-3 mx-1 drop-shadow hover:text-gray-200">
          Contact Us
        </Link>

         <Link href={routes.search} className="text-white px-3 mx-1 drop-shadow hover:text-gray-200">
          Guides
        </Link>
      </div>

      <div className="flex items-center gap-4">

        {isAuthenticated ? (
          <>
            <Link href={routes.dashboard} className="text-white drop-shadow hover:text-gray-200">
              Dashboard
            </Link>
            {user?.role === "HOST" || user?.role === "ADMIN" ? (
              <Link href={routes.admin} className="text-white drop-shadow hover:text-gray-200">
                Admin
              </Link>
            ) : null}
            <button
              onClick={clearAuth}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 drop-shadow"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href={routes.login} className="text-white drop-shadow hover:text-gray-200">
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