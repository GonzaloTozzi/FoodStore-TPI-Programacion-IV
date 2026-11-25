import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import { axiosInstance } from "@/shared/api/api";
import { useNotificationStore } from "@/store/notificationStore";
import type { UsuarioAuth } from "../types/auth.types";

const obtenerUsuarios = async (): Promise<UsuarioAuth[]> => {
  const response = await axiosInstance.get<UsuarioAuth[]>(
    "/admin/usuarios"
  );

  return response.data;
};

const activarUsuario = async (id: number): Promise<void> => {
  await axiosInstance.post(
    `/admin/usuarios/${id}/activar`
  );
};

const desactivarUsuario = async (id: number): Promise<void> => {
  await axiosInstance.post(
    `/admin/usuarios/${id}/desactivar`
  );
};

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const mostrarError = (error: unknown, mensaje: string) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) return;

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        showNotification(detail);
        return;
      }
    }

    showNotification(mensaje);
  };

  // Obtener usuarios
  const usuariosQuery = useQuery({
    queryKey: ["admin", "usuarios"],
    queryFn: obtenerUsuarios,
  });

  // Activar usuario
  const activarMutation = useMutation({
    mutationFn: activarUsuario,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "usuarios"],
      });

      showNotification("Usuario activado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al activar el usuario");
    },
  });

  // Desactivar usuario
  const desactivarMutation = useMutation({
    mutationFn: desactivarUsuario,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "usuarios"],
      });

      showNotification("Usuario desactivado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al desactivar el usuario");
    },
  });

  return {
    usuariosQuery,
    activarMutation,
    desactivarMutation,
  };
}