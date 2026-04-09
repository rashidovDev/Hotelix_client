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

export const useAuth = () => {
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationResponse>(LOGIN);

  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationResponse>(REGISTER);

  const [logoutMutation] = useMutation<LogoutMutationResponse>(LOGOUT);

 const login = async (input: LoginInput) => {
  try {
    const { data } = await loginMutation({ variables: { input } });
    if (data?.login) {
      const { accessToken, user } = data.login;
      setAuth(user, accessToken);
      router.push(routes.dashboard); // always dashboard
    }
  } catch (error) {
    throw error;
  }
};

const register = async (input: RegisterInput) => {
  try {
    const { data } = await registerMutation({ variables: { input } });
    if (data?.register) {
      const { accessToken, user } = data.register;
      setAuth(user, accessToken);
      router.push(routes.dashboard); // always dashboard
    }
  } catch (error) {
    throw error;
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