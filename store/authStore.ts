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
  
  // Set the same structure that middleware expects
  const cookieValue = JSON.stringify({
    state: authState,
  });
  
  document.cookie = `hotelix-auth=${encodeURIComponent(cookieValue)}; path=/; samesite=lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "hotelix-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    { 
      name: "hotelix-auth",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);