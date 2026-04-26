"use client";

import { useSearchParams } from "next/navigation";

export default function HotelsTitle() {
  const searchParams = useSearchParams();
  const ownerId = searchParams?.get("ownerId")?.trim() || "";
  const destination = searchParams?.get("city")?.trim() || "";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:pb-12 lg:pb-16 pt-6 sm:pt-8 lg:pt-14 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow">
        {ownerId ? "Host's Hotels" : destination ? `Hotels in ${destination}` : "Hotels"}
      </h1>
      <p className="mt-2 max-w-2xl text-xs sm:text-sm text-sky-50">
        Compare stays, filter smarter, and book your perfect city escape.
      </p>
    </div>
  );
}
