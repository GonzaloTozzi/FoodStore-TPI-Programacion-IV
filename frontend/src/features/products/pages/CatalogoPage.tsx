import { useState } from "react";

import ProductoCard from "../components/ProductoCard";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { Producto } from "../types/producto";
import { useCartStore } from "@/store/cartStore";

function CatalogoPage() {
  const [search, setSearch] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [pagina, setPagina] = useState(0);
  const agregar = useCartStore((state) => state.agregar);

  const limit = 8;

  const { categoriasQuery } = useCategories();

  const { productosQuery } = useProducts({
    skip: pagina * limit,
    limit,
    search: search.trim() || undefined,
    categoria_id: categoriaId,
  });

  const categorias = categoriasQuery.data ?? [];
  const productos = productosQuery.data?.items ?? [];
  const total = productosQuery.data?.total ?? 0;
  const totalPaginas = Math.ceil(total / limit);

  const handleAgregar = (producto: Producto) => {
  agregar(producto);
  };   

  const inputClass =
    "rounded border border-gray-300 bg-white px-4 py-2 " +
    "text-gray-900 outline-none focus:border-blue-500 " +
    "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">

      <h1 className="mb-2 text-3xl font-bold">
        Catálogo de productos
      </h1>

      <p className="mb-6 text-gray-600 dark:text-slate-400">
        Elegí tus productos favoritos y armá tu pedido.
      </p>

      {/* Búsqueda y filtros */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagina(0);
          }}
          className={`${inputClass} flex-1`}
        />

        <select
          aria-label="Filtrar por categoría"
          value={categoriaId ?? ""}
          onChange={(e) => {
            setCategoriaId(
              e.target.value ? Number(e.target.value) : undefined
            );
            setPagina(0);
          }}
          className={inputClass}
        >
          <option value="">Todas las categorías</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {categoriasQuery.isError && (
        <div className="mb-4">
          <EstadoMensaje
            tipo="error"
            mensaje="No se pudieron cargar las categorías."
          />
        </div>
      )}

      {/* Skeleton de carga */}
      {productosQuery.isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }, (_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="h-48 bg-gray-200 dark:bg-slate-700" />

              <div className="space-y-4 p-4">
                <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-10 rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado de error */}
      {productosQuery.isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="No se pudieron cargar los productos."
        />
      )}

      {/* Estado vacío */}
      {productosQuery.isSuccess && productos.length === 0 && (
        <EstadoMensaje
          tipo="vacio"
          mensaje="No se encontraron productos."
        />
      )}

      {/* Catálogo */}
      {productosQuery.isSuccess && productos.length > 0 && (
        <>
          <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
            {total} productos encontrados
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={handleAgregar}
              />
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={pagina === 0}
              onClick={() => setPagina((prev) => prev - 1)}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {pagina + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina((prev) => prev + 1)}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default CatalogoPage;