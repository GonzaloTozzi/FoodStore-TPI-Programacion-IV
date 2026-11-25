import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPedidos,
  getPedido,
  crearPedido,
  cambiarEstadoPedido,
  cancelarPedido,
  getResumenPedidos,
} from "../services/pedido";

import type {
  PedidosFiltros,
  CambioEstado,
} from "../types/pedido";

// Listar pedidos
export function usePedidos(filtros: PedidosFiltros = {}) {
  return useQuery({
    queryKey: ["pedidos", filtros],
    queryFn: () => getPedidos(filtros),
  });
}

// Obtener detalle de un pedido
export function usePedido(id: number) {
  return useQuery({
    queryKey: ["pedidos", "detalle", id],
    queryFn: () => getPedido(id),
    enabled: id > 0,
  });
}

// Crear pedido
export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
  });
}

// Cambiar estado (administrador)
export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CambioEstado;
    }) => cambiarEstadoPedido(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
  });
}

// Cancelar pedido (cliente)
export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelarPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["pedidos"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
  });
}

// Obtener resumen administrativo
export function useResumenPedidos() {
  return useQuery({
    queryKey: ["pedidos", "resumen"],
    queryFn: getResumenPedidos,
  });
}