"use client";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import HotelsContent from "@/components/hotels/HotelsContent";
import HotelsTitle from "@/components/hotels/HotelsTitle";

export default function HotelsPage() {
  return (
    <section className="min-h-screen bg-slate-50">
      <div
        className="relative min-h-[32vh] sm:min-h-[36vh] lg:min-h-[50vh] overflow-hidden"
        style={{
          backgroundImage: "url('/hotel.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="relative z-10">
          <Navbar />
          <Suspense fallback={null}>
            <HotelsTitle />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:w-[80%] lg:px-8">
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              Loading hotels...
            </div>
          </div>
        }
      >
        <HotelsContent />
      </Suspense>

      <FloatingChatWidget />
    </section>
  );
}
