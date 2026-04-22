"use client";

import { useMutation } from "@apollo/client/react";
import { useAuthStore } from "@/store/authStore";
import { LOGIN, REGISTER, LOGOUT } from "@/lib/graphql/mutations";
import { AuthResponse, LoginInput, RegisterInput } from "@/types";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

interface LoginMutationResponse { login: AuthResponse; }
interface RegisterMutationResponse { register: AuthResponse; }
interface LogoutMutationResponse { logout: boolean; }

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const useAuth = () => {
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationResponse>(LOGIN);

  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationResponse>(REGISTER);

  const [logoutMutation] = useMutation<LogoutMutationResponse>(LOGOUT);

  const login = async (input: LoginInput) => {
    clearAuth();

    try {
      const { data } = await loginMutation({ variables: { input } });
      const payload = data?.login;

      if (!payload?.accessToken || !payload?.user?.id) {
        throw new Error("Invalid login response");
      }

      setAuth(payload.user, payload.accessToken);
      router.push(routes.home);
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Login failed. Please try again.");
      throw new Error(message);
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({ variables: { input } });
      const payload = data?.register;

      if (!payload?.accessToken || !payload?.user?.id) {
        throw new Error("Invalid register response");
      }

      setAuth(payload.user, payload.accessToken);
      router.push(routes.home);
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Registration failed. Please try again.");
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {
      // ignore
    } finally {
      clearAuth();
      router.push("/");
    }
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user,
    loginLoading,
    registerLoading,
  };
};