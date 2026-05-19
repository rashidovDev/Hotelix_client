"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAuthFromCookie } from "@/store/authStore";

/**
 * Hook to restore auth from cookie if localStorage is empty
 * Useful for when localStorage is cleared but the cookie persists
 */
export function useRestoreAuthFromCookie() {
  useEffect(() => {
    const { user, isHydrated, isAuthenticated, setAuth } = useAuthStore.getState();
    
    // If hydration is complete but no user is logged in, try cookie
    if (isHydrated && !isAuthenticated && !user) {
      const authFromCookie = getAuthFromCookie();
      if (authFromCookie) {
        setAuth(authFromCookie.user, authFromCookie.accessToken);
      }
    }
  }, []);
}
