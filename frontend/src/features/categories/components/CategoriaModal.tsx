
import { useForm } from "@tanstack/react-form";

import EstadoMensaje from "@/shared/components/EstadoMensaje";
import type { Categoria } from "../types/categoria";

type CategoriaData = Pick<Categoria, "nombre" | "descripcion">;

type CategoriaModalProps = {
  categoria: Categoria | null;
  onSubmit: (data: CategoriaData) => void;
  onClose: () => void;
  error?: string | null;
};

function CategoriaModal({
  categoria,
  onSubmit,
  onClose,
  error,
}: CategoriaModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg transition-colors duration-200 dark:bg-slate-800 dark:shadow-black/30">

        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-slate-100">
          {categoria ? "Editar categoría" : "Nueva categoría"}
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
                value.trim().length < 2 || value.trim().length > 100
                  ? "El nombre debe tener entre 2 y 100 caracteres"
                  : undefined,
              onBlur: ({ value }) =>
                value.trim().length < 2 || value.trim().length > 100
                  ? "El nombre debe tener entre 2 y 100 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="mb-2 block font-medium text-gray-700 dark:text-slate-200"
                >
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Descripción */}
          <form.Field name="descripcion">
            {(field) => (
              <div className="mb-6">
                <label
                  htmlFor="descripcion"
                  className="mb-2 block font-medium text-gray-700 dark:text-slate-200"
                >
                  Descripción
                </label>

                <textarea
                  id="descripcion"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
                />
              </div>
            )}
          </form.Field>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4">
              <EstadoMensaje tipo="error" mensaje={error} />
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

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoriaModal;
