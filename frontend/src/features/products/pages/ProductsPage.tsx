import { useState } from "react";

import ProductoList from "../components/ProductoList";
import ProductoModal from "../components/ProductoModal";
import StockModal from "../components/StockModal";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

import type {
  Producto,
  ProductoData,
  ProductoStockUpdate,
} from "../types/producto";

import { useProducts } from "../hooks/useProducts";
import { useAuth } from "@/features/auth";

function ProductsPage() {
  const { isAdmin } = useAuth();

  // Estado local de la interfaz
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const [productoStock, setProductoStock] =
    useState<Producto | null>(null);

  // Consultas y mutaciones
  const {
    productosQuery,
    crearMutation,
    actualizarMutation,
    eliminarMutation,
    stockMutation,
  } = useProducts();

  const { data, isLoading, isError } = productosQuery;

  const productos = data?.items ?? [];

  // Limpiar errores anteriores
  const limpiarErrores = () => {
    crearMutation.reset();
    actualizarMutation.reset();
    eliminarMutation.reset();
    stockMutation.reset();
  };

  // Abrir formulario de creación
  const handleOpenCreate = () => {
    if (!isAdmin) return;

    limpiarErrores();
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  // Cerrar formulario
  const handleCloseModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    limpiarErrores();
  };

  // Abrir formulario de edición
  const handleEdit = (producto: Producto) => {
    if (!isAdmin) return;

    limpiarErrores();
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  // Eliminar producto
  const handleDelete = (id: number) => {
    if (!isAdmin) return;

    eliminarMutation.reset();

    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este producto?"
    );

    if (!confirmar) return;

    eliminarMutation.mutate(id);
  };

  // Crear o actualizar producto
  const handleSubmit = (data: ProductoData) => {
    if (!isAdmin) return;

    if (crearMutation.isPending || actualizarMutation.isPending) return;

    if (productoSeleccionado) {
      actualizarMutation.mutate(
        {
          id: productoSeleccionado.id,
          data,
        },
        {
          onSuccess: handleCloseModal,
        }
      );
    } else {
      crearMutation.mutate(data, {
        onSuccess: handleCloseModal,
      });
    }
  };

  // Abrir modal de stock
  const handleStock = (producto: Producto) => {
    if (!isAdmin) return;

    limpiarErrores();
    setProductoStock(producto);
  };

  // Actualizar stock y disponibilidad
  const handleSubmitStock = async (data: ProductoStockUpdate) => {
    if (!isAdmin || !productoStock) return;

    try {
      await stockMutation.mutateAsync({
        id: productoStock.id,
        data,
      });

      setProductoStock(null);
    } catch {
      // El hook muestra la notificación del error.
    }
  };

  // Error del formulario
  const errorModal =
    crearMutation.isError || actualizarMutation.isError
      ? "Error al guardar el producto. Verificá los datos e intentá nuevamente."
      : null;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          Productos
        </h2>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Nuevo producto
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <EstadoMensaje
          tipo="carga"
          mensaje="Cargando productos..."
        />
      )}

      {/* Error al obtener productos */}
      {isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="Error al cargar los productos."
        />
      )}

      {/* Listado de productos */}
      {!isLoading && !isError && (
        <ProductoList
          productos={productos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStock={handleStock}
          isAdmin={isAdmin}
        />
      )}

      {/* Error al eliminar */}
      {eliminarMutation.isError && (
        <div className="mt-4">
          <EstadoMensaje
            tipo="error"
            mensaje="Error al eliminar el producto."
          />
        </div>
      )}

      {/* Modal de creación y edición */}
      {isAdmin && modalAbierto && (
        <ProductoModal
          key={productoSeleccionado?.id ?? "nuevo"}
          producto={productoSeleccionado}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          error={errorModal}
        />
      )}

      {/* Modal de stock */}
      {isAdmin && productoStock && (
        <StockModal
          key={productoStock.id}
          producto={productoStock}
          onSubmit={handleSubmitStock}
          onClose={() => setProductoStock(null)}
        />
      )}
    </main>
  );
}

export default ProductsPage;