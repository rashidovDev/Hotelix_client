import { useMutation } from "@apollo/client/react";
import { useAuthStore } from "@/store/authStore";
import { LOGIN, REGISTER } from "@/lib/graphql/mutations";
import { LoginInput, RegisterInput, AuthResponse } from "@/types";
import { useRouter } from "next/navigation";

// Define response types
interface LoginMutationResponse {
  login: AuthResponse;
}

interface RegisterMutationResponse {
  register: AuthResponse;
}

export const useAuth = () => {
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationResponse>(LOGIN);

  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationResponse>(REGISTER);

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({ variables: { input } });
      if (data?.login) {
        const { accessToken, refreshToken } = data.login;
        setAuth(user!, accessToken, refreshToken);
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({ variables: { input } });
      if (data?.register) {
        const { accessToken, refreshToken } = data.register;
        setAuth(user!, accessToken, refreshToken);
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    router.push("/");
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