import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserEntity } from "@/types";

interface AuthState {
  user: UserEntity | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserEntity, accessToken: string) => void;
  updateUser: (user: UserEntity) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      updateUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: "hotelix-auth" }
  )
);