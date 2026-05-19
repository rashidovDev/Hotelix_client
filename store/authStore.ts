import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserEntity } from "@/types";

interface AuthState {
  user: UserEntity | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: UserEntity, accessToken: string) => void;
  updateUser: (user: UserEntity) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

function setAuthCookie(user: UserEntity, accessToken: string) {
  if (typeof document === "undefined") return;
  
  const authState = {
    user,
    accessToken,
    isAuthenticated: true,
  };
  
  // Set the same structure that middleware expects with 30-day expiration
  const cookieValue = JSON.stringify({
    state: authState,
  });
  
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const expiryDate = new Date(Date.now() + maxAge * 1000).toUTCString();
  
  document.cookie = `hotelix-auth=${encodeURIComponent(cookieValue)}; path=/; expires=${expiryDate}; samesite=lax; secure`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "hotelix-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=lax;";
}

function getAuthFromCookie(): { user: UserEntity; accessToken: string } | null {
  if (typeof document === "undefined") return null;
  
  try {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hotelix-auth="))
      ?.split("=")[1];
    
    if (!cookieValue) return null;
    
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded);
    
    if (parsed?.state?.user && parsed?.state?.accessToken) {
      return {
        user: parsed.state.user,
        accessToken: parsed.state.accessToken,
      };
    }
  } catch (error) {
    console.error("Failed to read auth cookie:", error);
  }
  
  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, accessToken) => {
        setAuthCookie(user, accessToken);
        set({ user, accessToken, isAuthenticated: true, isHydrated: true });
      },
      updateUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () => {
        clearAuthCookie();
        set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: false });
      },
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    { 
      name: "hotelix-auth",
      onRehydrateStorage: () => (state) => {
        // First try to restore from localStorage
        if (state) {
          state.isHydrated = true;
          return state;
        }
        
        // If localStorage is empty, try to restore from cookie
        const authFromCookie = getAuthFromCookie();
        if (authFromCookie) {
          return {
            user: authFromCookie.user,
            accessToken: authFromCookie.accessToken,
            isAuthenticated: true,
            isHydrated: true,
            setAuth: (user: UserEntity, accessToken: string) => {
              // This will be overridden by the actual store
            },
            updateUser: (user: UserEntity) => {},
            clearAuth: () => {},
            setHydrated: (value: boolean) => {},
          };
        }
        
        return state;
      },
    }
  )
);

export { getAuthFromCookie };