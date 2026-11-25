
import { axiosInstance } from "@/shared/api/api";
import type { Categoria } from "../types/categoria";


type CategoriaData = Pick<Categoria, "nombre" | "descripcion">;

// Obtener todas las categorías
export async function getCategorias(): Promise<Categoria[]> {
  const response = await axiosInstance.get<Categoria[]>(
    "/categorias"
  );

  return response.data;
}

// Crear una categoría
export async function crearCategoria(
  data: CategoriaData
): Promise<Categoria> {
  const response = await axiosInstance.post<Categoria>(
    "/categorias",
    data
  );

  return response.data;
}

// Actualizar una categoría
export async function actualizarCategoria(
  id: number,
  data: CategoriaData
): Promise<Categoria> {
  const response = await axiosInstance.put<Categoria>(
    `/categorias/${id}`,
    data
  );

  return response.data;
}

// Eliminar una categoría
export async function eliminarCategoria(
  id: number
): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`);
}
