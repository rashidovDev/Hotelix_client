"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface RouteChromeProps {
  children: React.ReactNode;
}

export default function RouteChrome({ children }: RouteChromeProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isHotelsRoute = pathname === "/hotels";
  const isHotelDetailsRoute = pathname.startsWith("/hotels/");
  const isHomeRoute = pathname === "/";

  if (isAuthRoute || isDashboardRoute) {
    return <main className="flex-1">{children}</main>;
  }

  if (isHomeRoute) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Footer />
      </>
    );
  }

  if (isHotelsRoute || isHotelDetailsRoute) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}