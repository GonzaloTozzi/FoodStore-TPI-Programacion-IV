import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import type {
  ProductoData,
  ProductosFiltros,
  ProductoStockUpdate,
} from "../types/producto";

import {
  getProductos,
  crearProducto,
  actualizarProducto,
  actualizarStock,
  eliminarProducto,
} from "../services/producto";

import { useNotificationStore } from "@/store/notificationStore";

export function useProducts(
  filtros: ProductosFiltros = { skip: 0, limit: 100 }
) {
  const queryClient = useQueryClient();

  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  // Manejo de errores
  const mostrarError = (error: unknown, mensaje: string) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return;
      }

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        showNotification(detail);
        return;
      }
    }

    showNotification(mensaje);
  };

  // Obtener productos con filtros y paginación
  const productosQuery = useQuery({
    queryKey: ["productos", filtros],
    queryFn: () => getProductos(filtros),
  });

  // Crear producto
  const crearMutation = useMutation({
    mutationFn: crearProducto,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto creado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al crear el producto");
    },
  });

  // Actualizar producto
  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ProductoData;
    }) => actualizarProducto(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto actualizado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al actualizar el producto");
    },
  });

  // Actualizar stock y disponibilidad
  const stockMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ProductoStockUpdate;
    }) => actualizarStock(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Stock actualizado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al actualizar el stock");
    },
  });

  // Eliminar producto
  const eliminarMutation = useMutation({
    mutationFn: eliminarProducto,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto eliminado correctamente");
    },

    onError: (error) => {
      mostrarError(error, "Error al eliminar el producto");
    },
  });

  return {
    productosQuery,
    crearMutation,
    actualizarMutation,
    stockMutation,
    eliminarMutation,
  };
}