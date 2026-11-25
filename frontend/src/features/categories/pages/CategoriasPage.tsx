
import { useState } from "react";

import CategoriaList from "../components/CategoriaList";
import CategoriaModal from "../components/CategoriaModal";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

import type { Categoria } from "../types/categoria";

import { useCategories } from "../hooks/useCategories";
import { useAuth } from "@/features/auth";

type CategoriaData = Pick<Categoria, "nombre" | "descripcion">;

function CategoriasPage() {
  const { isAdmin } = useAuth();

  // Estado local de la interfaz
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);

  // Operaciones del custom hook
  const {
    categoriasQuery,
    crearMutation,
    actualizarMutation,
    eliminarMutation,
  } = useCategories();

  const {
    data: categorias = [],
    isLoading,
    isError,
  } = categoriasQuery;

  // Limpiar errores de las mutaciones
  const limpiarErrores = () => {
    crearMutation.reset();
    actualizarMutation.reset();
    eliminarMutation.reset();
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    if (!isAdmin) return;

    limpiarErrores();
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
    limpiarErrores();
  };

  // Abrir modal para editar
  const handleEdit = (categoria: Categoria) => {
    if (!isAdmin) return;

    limpiarErrores();
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  // Eliminar categoría
  const handleDelete = (id: number) => {
    if (!isAdmin) return;

    eliminarMutation.reset();

    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar esta categoría?"
    );

    if (!confirmar) return;

    eliminarMutation.mutate(id);
  };

  // Crear o actualizar categoría
  const handleSubmit = (data: CategoriaData) => {
    if (!isAdmin) return;

    if (categoriaSeleccionada) {
      actualizarMutation.mutate(
        {
          id: categoriaSeleccionada.id,
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

  // Error del formulario
  const errorModal =
    crearMutation.isError || actualizarMutation.isError
      ? "Error al guardar la categoría. Verificá los datos e intentá nuevamente."
      : null;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          Categorías
        </h2>

        {/* Solo administradores pueden crear */}
        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Nueva categoría
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <EstadoMensaje
          tipo="carga"
          mensaje="Cargando categorías..."
        />
      )}

      {/* Error al obtener categorías */}
      {isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="Error al cargar las categorías."
        />
      )}

      {/* Listado de categorías */}
      {!isLoading && !isError && (
        <CategoriaList
          categorias={categorias}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      {/* Error al eliminar */}
      {eliminarMutation.isError && (
        <div className="mt-4">
          <EstadoMensaje
            tipo="error"
            mensaje="Error al eliminar la categoría."
          />
        </div>
      )}

      {/* Modal de creación y edición */}
      {isAdmin && modalAbierto && (
        <CategoriaModal
          key={categoriaSeleccionada?.id ?? "nueva"}
          categoria={categoriaSeleccionada}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          error={errorModal}
        />
      )}
    </main>
  );
}

export default CategoriasPage;
