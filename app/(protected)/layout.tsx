"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/dashboard/Sidebar";
import { routes } from "@/config/routes";

function hasValidAuth(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const authStorage = localStorage.getItem("hotelix-auth");
    if (!authStorage) return false;
    
    const parsed = JSON.parse(authStorage);
    const { state } = parsed;
    
    return !!(state?.accessToken && state?.user?.id && state?.isAuthenticated);
  } catch {
    return false;
  }
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);

  // Check auth immediately on mount
  useEffect(() => {
    const validAuth = hasValidAuth();
    setHasAuth(validAuth);
    setIsReady(true);
  }, []);

  // Redirect if no auth after mount
  useEffect(() => {
    if (!isReady) return;
    
    // Use either Zustand state or localStorage check
    const isUserAuthenticated = isAuthenticated || hasAuth;
    
    if (!isUserAuthenticated) {
      router.push(routes.login);
    }
  }, [isReady, isAuthenticated, hasAuth, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isUserAuthenticated = isAuthenticated || hasAuth;

  if (!isUserAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="hidden md:block md:w-64 lg:w-72">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}