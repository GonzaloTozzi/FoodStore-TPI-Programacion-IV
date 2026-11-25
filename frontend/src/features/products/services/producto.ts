import { axiosInstance } from "@/shared/api/api";

import type {
  Producto,
  ProductoData,
  ProductosPaginados,
  ProductosFiltros,
  ProductoStockUpdate,
} from "../types/producto";

export type { ProductoData } from "../types/producto";

// Obtener productos con paginación y filtros
export async function getProductos(
  filtros: ProductosFiltros = {}
): Promise<ProductosPaginados> {
  const response = await axiosInstance.get<ProductosPaginados>(
    "/productos",
    {
      params: filtros,
    }
  );

  return response.data;
}

// Obtener el detalle de un producto
export async function getProducto(
  id: number
): Promise<Producto> {
  const response = await axiosInstance.get<Producto>(
    `/productos/${id}`
  );

  return response.data;
}

// Crear un producto
export async function crearProducto(
  data: ProductoData
): Promise<Producto> {
  const response = await axiosInstance.post<Producto>(
    "/productos",
    data
  );

  return response.data;
}

// Actualizar un producto
export async function actualizarProducto(
  id: number,
  data: Partial<ProductoData>
): Promise<Producto> {
  const response = await axiosInstance.put<Producto>(
    `/productos/${id}`,
    data
  );

  return response.data;
}

// Actualizar stock y disponibilidad
export async function actualizarStock(
  id: number,
  data: ProductoStockUpdate
): Promise<Producto> {
  const response = await axiosInstance.patch<Producto>(
    `/productos/${id}/stock`,
    data
  );

  return response.data;
}

// Eliminar un producto (baja lógica)
export async function eliminarProducto(
  id: number
): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`);
}