import { AxiosError } from "axios";
import { axiosInstance } from "./api";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

let interceptorsConfigurados = false;

export function setupInterceptors() {
  if (interceptorsConfigurados) return;

  interceptorsConfigurados = true;

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ detail?: string }>) => {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      const url = error.config?.url ?? "";

      const esLogin = url.includes("/auth/token");
      const esVerificacionSesion = url.includes("/auth/me");

      // 401: sesión inexistente o vencida
      if (
        status === 401 &&
        !esLogin &&
        !esVerificacionSesion
      ) {
        useAuthStore.getState().clearSession();
      }

      // 400: cuenta de usuario desactivada
      if (
        status === 400 &&
        detail === "Cuenta de usuario desactivada"
      ) {
        useAuthStore.getState().clearSession();
      }

      // 403: usuario sin permisos
      if (status === 403) {
        useNotificationStore
          .getState()
          .showNotification("Acceso denegado");
      }

      return Promise.reject(error);
    }
  );
}