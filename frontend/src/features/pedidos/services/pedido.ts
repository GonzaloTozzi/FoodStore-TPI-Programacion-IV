import { axiosInstance } from "@/shared/api/api";

import type {
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  PedidosFiltros,
  CambioEstado,
  ResumenPedidos,
} from "../types/pedido";

// Listar pedidos
export async function getPedidos(
  filtros: PedidosFiltros = {}
): Promise<PedidosPaginados> {
  const response = await axiosInstance.get<PedidosPaginados>(
    "/pedidos",
    { params: filtros }
  );

  return response.data;
}

// Obtener detalle
export async function getPedido(id: number): Promise<Pedido> {
  const response = await axiosInstance.get<Pedido>(
    `/pedidos/${id}`
  );

  return response.data;
}

// Crear pedido
export async function crearPedido(
  data: PedidoCreate
): Promise<Pedido> {
  const response = await axiosInstance.post<Pedido>(
    "/pedidos",
    data
  );

  return response.data;
}

// Cambiar estado (administrador)
export async function cambiarEstadoPedido(
  id: number,
  data: CambioEstado
): Promise<Pedido> {
  const response = await axiosInstance.patch<Pedido>(
    `/pedidos/${id}/estado`,
    data
  );

  return response.data;
}

// Cancelar pedido (cliente)
export async function cancelarPedido(
  id: number
): Promise<Pedido> {
  const response = await axiosInstance.patch<Pedido>(
    `/pedidos/${id}/cancelar`
  );

  return response.data;
}

// Obtener resumen administrativo
export async function getResumenPedidos(): Promise<ResumenPedidos> {
  const response = await axiosInstance.get<ResumenPedidos>(
    "/pedidos/resumen"
  );

  return response.data;
}