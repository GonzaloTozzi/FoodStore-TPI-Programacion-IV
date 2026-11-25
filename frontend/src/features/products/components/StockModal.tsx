import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoStockUpdate } from "../types/producto";

type StockModalProps = {
  producto: Producto;
  onSubmit: (data: ProductoStockUpdate) => Promise<void>;
  onClose: () => void;
};

function StockModal({ producto, onSubmit, onClose }: StockModalProps) {
  const form = useForm({
    defaultValues: {
      stock: producto.stock,
      disponible: producto.disponible,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800 dark:text-slate-100">
        <h2 className="mb-2 text-xl font-semibold">
          Actualizar stock
        </h2>

        <p className="mb-4 text-gray-600 dark:text-slate-400">
          {producto.nombre}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
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
                <label className="mb-2 block font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  required
                  min={0}
                  step={1}
                  value={Number.isNaN(field.state.value) ? "" : field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.valueAsNumber)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <label className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.checked)
                  }
                  className="h-4 w-4 accent-blue-600"
                />
                Producto disponible
              </label>
            )}
          </form.Field>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500"
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
                  disabled={!canSubmit || isSubmitting}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
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

export default StockModal;