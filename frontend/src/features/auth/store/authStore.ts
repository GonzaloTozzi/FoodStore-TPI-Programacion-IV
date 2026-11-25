import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "@/shared/api/api";
import type { UsuarioAuth } from "../types/auth.types";

interface AuthState {
  user: UsuarioAuth | null;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      login: async (username, password) => {
        set({ isLoading: true });

        try {
          const formData = new URLSearchParams();

          formData.append("username", username);
          formData.append("password", password);

          await axiosInstance.post("/auth/token", formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          const response = await axiosInstance.get<UsuarioAuth>(
            "/auth/me"
          );

          set({ user: response.data });
        } catch (error) {
          set({ user: null });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } finally {
          set({ user: null, isLoading: false });
        }
      },

      checkSession: async () => {
        set({ isLoading: true });

        try {
          const response = await axiosInstance.get<UsuarioAuth>(
            "/auth/me"
          );

          set({ user: response.data });
        } catch {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },

      clearSession: () => {
        set({ user: null, isLoading: false });
      },
    }),
    {
      name: "foodstore-auth",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);