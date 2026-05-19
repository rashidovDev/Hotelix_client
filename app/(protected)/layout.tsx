"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getAuthFromCookie } from "@/store/authStore";
import Sidebar from "@/components/dashboard/Sidebar";
import { routes } from "@/config/routes";

function hasValidAuth(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    // Check localStorage for auth data
    const authStorage = localStorage.getItem("hotelix-auth");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const { state } = parsed;
      
      // Valid auth requires: accessToken, user.id, and isAuthenticated flag
      if (state?.accessToken && state?.user?.id && state?.isAuthenticated === true) {
        return true;
      }
    }
    
    // Fallback: try to restore from cookie
    const authFromCookie = getAuthFromCookie();
    if (authFromCookie?.accessToken && authFromCookie?.user?.id) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Auth validation error:", error);
    return false;
  }
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check auth only once on mount - block access if not logged in
  useEffect(() => {
    const checkAuthAndAuthorize = () => {
      const validAuth = hasValidAuth();
      
      if (!validAuth) {
        // User is not authenticated - redirect to login
        router.replace(routes.login);
        // Don't set isReady or isAuthorized - return early
        return;
      }
      
      // User is authenticated - allow access
      setIsAuthorized(true);
      setIsReady(true);
    };

    // Run check on mount
    checkAuthAndAuthorize();
  }, []); // Empty dependency - runs only once

  // Show loading state while checking auth
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect already happened)
  if (!isAuthorized) {
    return null;
  }

  // User is authorized - render the protected content
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