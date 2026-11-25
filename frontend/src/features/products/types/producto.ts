import type { Categoria } from "@/features/categories/types/categoria";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagen_url: string;
  categoria_id: number;
  categoria: Categoria;
  stock: number;
  disponible: boolean;
  activo: boolean;
}

export interface ProductoData {
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagen_url: string;
  categoria_id: number;
  stock: number;
  disponible: boolean;
}

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

export interface ProductoStockUpdate {
  stock: number;
  disponible: boolean;
}

export interface ProductosFiltros {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}