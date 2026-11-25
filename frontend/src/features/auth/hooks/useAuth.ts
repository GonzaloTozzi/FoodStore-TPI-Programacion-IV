import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "@/shared/api/api";
import type { RegisterData } from "../types/auth.types";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const checkSession = useAuthStore(
    (state) => state.checkSession
  );
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );

  // Registrar un nuevo usuario
  const register = async (data: RegisterData): Promise<void> => {
    await axiosInstance.post("/auth/register", data);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
    checkSession,
    clearSession,
  };
}