
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import type { Categoria } from "../types/categoria";

import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categoria";

import { useNotificationStore } from "@/store/notificationStore";

type CategoriaData = Pick<Categoria, "nombre" | "descripcion">;

export function useCategories() {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  // Evitar duplicar la notificación de acceso denegado.
  // El interceptor global ya maneja los errores 403.
  const mostrarError = (error: unknown, mensaje: string) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 403
    ) {
      return;
    }

    showNotification(mensaje);
  };

  // Obtener categorías
  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  // Crear categoría
  const crearMutation = useMutation({
    mutationFn: crearCategoria,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification("Categoría creada correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al crear la categoría");
    },
  });

  // Actualizar categoría
  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CategoriaData;
    }) => actualizarCategoria(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification("Categoría actualizada correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al actualizar la categoría");
    },
  });

  // Eliminar categoría
  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoria,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });

      showNotification("Categoría eliminada correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al eliminar la categoría");
    },
  });

  return {
    categoriasQuery,
    crearMutation,
    actualizarMutation,
    eliminarMutation,
  };
}
