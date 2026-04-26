"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { GET_MY_SUBSCRIPTIONS } from "@/lib/graphql/queries";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";

interface SubscriptionItem {
  id: string;
  userId: string;
  hotelId: string;
  createdAt: string;
}

interface MySubscriptionsResponse {
  mySubscriptions: SubscriptionItem[];
}

export default function MySubscriptionsPage() {
  const { isAuthenticated } = useAuthStore();
  const { data, loading, error } = useQuery<MySubscriptionsResponse>(
    GET_MY_SUBSCRIPTIONS
  );

  const subscriptions = data?.mySubscriptions ?? [];

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: routes.home },
              { label: "Subscriptions" },
            ]}
            className="mb-6"
          />

          <p className="text-slate-600">Please sign in to view your subscriptions.</p>
          <Link
            href={routes.login}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative min-h-[32vh] sm:min-h-[36vh] lg:min-h-[50vh] overflow-hidden" style={{
        backgroundImage: "url('/hotel.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="relative z-10">
          <Navbar />
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:pb-12 lg:pb-16 pt-6 sm:pt-8 lg:pt-14 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow">
              My Subscriptions
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-sky-50">
              Track hotels you&apos;re interested in.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:w-[80%] lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "Subscriptions" },
          ]}
          className="mb-6"
        />

        <Link
          href={routes.hotels}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hotels
        </Link>

        {loading && (
          <div className="rounded-2xl bg-white p-6 sm:p-8 text-center text-xs sm:text-sm text-slate-500 shadow-md">
            Loading your subscriptions...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 sm:p-8 text-center text-xs sm:text-sm text-red-600 shadow-md border border-red-200">
            Failed to load subscriptions. Please try again.
          </div>
        )}

        {!loading && !error && subscriptions.length === 0 && (
          <div className="rounded-2xl bg-white p-6 sm:p-8 text-center text-xs sm:text-sm text-slate-500 shadow-md">
            <p>You haven&apos;t subscribed to any hotels yet.</p>
            <Link
              href={routes.hotels}
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Explore Hotels
            </Link>
          </div>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 mb-4">
              {subscriptions.length} subscription{subscriptions.length === 1 ? "" : "s"}
            </p>
            {subscriptions.map((subscription) => (
              <Link
                key={subscription.id}
                href={`${routes.hotels}/${subscription.hotelId}`}
                className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Hotel ID: {subscription.hotelId}</p>
                    <p className="text-xs text-slate-500">
                      Subscribed {new Date(subscription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">View Hotel →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
