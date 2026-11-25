import { useForm } from "@tanstack/react-form";

import EstadoMensaje from "@/shared/components/EstadoMensaje";
import { useCategories } from "@/features/categories/hooks/useCategories";

import type { Producto, ProductoData } from "../types/producto";

type ProductoModalProps = {
  producto: Producto | null;
  onSubmit: (data: ProductoData) => void;
  onClose: () => void;
  error?: string | null;
};

function ProductoModal({
  producto,
  onSubmit,
  onClose,
  error,
}: ProductoModalProps) {
  const { categoriasQuery } = useCategories();

  const categorias = categoriasQuery.data ?? [];

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      categoria_id: producto?.categoria_id ?? 0,
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
    },

    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: value.precio_base,
        imagen_url: value.imagen_url.trim(),
        categoria_id: value.categoria_id,
        stock: value.stock,
        disponible: value.disponible,
      });
    },
  });

  const inputClass =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 " +
    "text-gray-900 outline-none focus:border-blue-500 " +
    "dark:border-slate-600 dark:bg-slate-700 dark:text-white " +
    "dark:focus:border-blue-400";

  const labelClass =
    "mb-2 block font-medium text-gray-700 dark:text-slate-200";

  const errorClass =
    "mt-1 text-sm text-red-600 dark:text-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg transition-colors duration-200 dark:bg-slate-800 dark:shadow-black/30">

        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-slate-100">
          {producto ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {/* Nombre */}
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                !value.trim()
                  ? "El nombre es obligatorio"
                  : undefined,
              onSubmit: ({ value }) =>
                !value.trim()
                  ? "El nombre es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="producto-nombre"
                  className={labelClass}
                >
                  Nombre
                </label>

                <input
                  id="producto-nombre"
                  type="text"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Descripción */}
          <form.Field name="descripcion">
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="producto-descripcion"
                  className={labelClass}
                >
                  Descripción
                </label>

                <textarea
                  id="producto-descripcion"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  rows={3}
                  className={inputClass}
                />
              </div>
            )}
          </form.Field>

          {/* Categoría */}
          <form.Field
            name="categoria_id"
            validators={{
              onChange: ({ value }) =>
                value <= 0
                  ? "Seleccioná una categoría"
                  : undefined,
              onSubmit: ({ value }) =>
                value <= 0
                  ? "Seleccioná una categoría"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="producto-categoria"
                  className={labelClass}
                >
                  Categoría
                </label>

                <select
                  id="producto-categoria"
                  required
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                  disabled={
                    categoriasQuery.isLoading ||
                    categoriasQuery.isError
                  }
                  className={inputClass}
                >
                  <option value="">
                    Seleccionar categoría
                  </option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                {categoriasQuery.isLoading && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Cargando categorías...
                  </p>
                )}

                {categoriasQuery.isError && (
                  <p className={errorClass}>
                    Error al cargar las categorías.
                  </p>
                )}

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Precio y stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Precio base */}
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) =>
                  !Number.isFinite(value) || value < 0
                    ? "El precio debe ser mayor o igual a 0"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="mb-4">
                  <label
                    htmlFor="producto-precio"
                    className={labelClass}
                  >
                    Precio base ($)
                  </label>

                  <input
                    id="producto-precio"
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={
                      Number.isNaN(field.state.value)
                        ? ""
                        : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ""
                          ? Number.NaN
                          : Number(e.target.value)
                      )
                    }
                    className={inputClass}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className={errorClass}>
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Stock */}
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  !Number.isInteger(value) || value < 0
                    ? "El stock debe ser un entero mayor o igual a 0"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="mb-4">
                  <label
                    htmlFor="producto-stock"
                    className={labelClass}
                  >
                    Stock
                  </label>

                  <input
                    id="producto-stock"
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={
                      Number.isNaN(field.state.value)
                        ? ""
                        : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ""
                          ? Number.NaN
                          : Number(e.target.value)
                      )
                    }
                    className={inputClass}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className={errorClass}>
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Imagen */}
          <form.Field name="imagen_url">
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="producto-imagen"
                  className={labelClass}
                >
                  URL de la imagen
                </label>

                <input
                  id="producto-imagen"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            )}
          </form.Field>

          {/* Disponibilidad */}
          <form.Field name="disponible">
            {(field) => (
              <div className="mb-6 flex items-center gap-2">
                <input
                  id="producto-disponible"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.checked)
                  }
                  className="h-4 w-4 accent-blue-600 dark:accent-blue-400"
                />

                <label
                  htmlFor="producto-disponible"
                  className="font-medium text-gray-700 dark:text-slate-200"
                >
                  Producto disponible
                </label>
              </div>
            )}
          </form.Field>

          {/* Error del backend */}
          {error && (
            <div className="mb-4">
              <EstadoMensaje
                tipo="error"
                mensaje={error}
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
            >
              Cancelar
            </button>

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
              ]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    categoriasQuery.isLoading ||
                    categoriasQuery.isError
                  }
                  className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductoModal;