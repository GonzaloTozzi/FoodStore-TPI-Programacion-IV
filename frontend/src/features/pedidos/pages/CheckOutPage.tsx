import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCartStore } from "@/store/cartStore";
import { useCrearPedido } from "../hooks/usePedidos";
import type { FormaPago } from "../types/pedido";

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, vaciar } = useCartStore();
  const crearMutation = useCrearPedido();

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        await crearMutation.mutateAsync({
          direccion_entrega: value.direccion_entrega.trim(),
          forma_pago: value.forma_pago,
          notas: value.notas.trim(),
          items: items.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
          })),
        });

        vaciar();
        navigate("/mis-pedidos", { replace: true });
      } catch (err) {
        const detail = axios.isAxiosError(err)
          ? err.response?.data?.detail
          : null;

        setError(
          typeof detail === "string"
            ? detail
            : "No se pudo confirmar el pedido."
        );
      }
    },
  });

  const formatoPrecio = (precio: number) =>
    precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const inputClass =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 " +
    "text-gray-900 outline-none focus:border-blue-500 " +
    "dark:border-slate-600 dark:bg-slate-700 dark:text-white";

  const cardClass =
    "rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800";

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className={`${cardClass} text-center`}>
          <p className="mb-4">Tu carrito está vacío.</p>
          <Link
            to="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Confirmar pedido
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulario */}
        <div className={cardClass}>
          <h2 className="mb-4 text-xl font-semibold">
            Datos de entrega
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="direccion_entrega"
              validators={{
                onChange: ({ value }) =>
                  value.trim().length < 5 ||
                  value.trim().length > 200
                    ? "La dirección debe tener entre 5 y 200 caracteres"
                    : undefined,
                onSubmit: ({ value }) =>
                  value.trim().length < 5 ||
                  value.trim().length > 200
                    ? "Ingresá una dirección válida"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="mb-4">
                  <label className="mb-2 block font-medium">
                    Dirección de entrega
                  </label>

                  <input
                    type="text"
                    required
                    minLength={5}
                    maxLength={200}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Calle y número"
                  />

                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                </div>
              )}
            </form.Field>

            <form.Field name="forma_pago">
              {(field) => (
                <div className="mb-4">
                  <label className="mb-2 block font-medium">
                    Forma de pago
                  </label>

                  <select
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as FormaPago)
                    }
                    className={inputClass}
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">
                      Transferencia
                    </option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="notas">
              {(field) => (
                <div className="mb-6">
                  <label className="mb-2 block font-medium">
                    Notas (opcional)
                  </label>

                  <textarea
                    rows={3}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Indicaciones adicionales..."
                  />
                </div>
              )}
            </form.Field>

            {error && (
              <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </p>
            )}

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
                  className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isSubmitting
                    ? "Confirmando..."
                    : "Confirmar pedido"}
                </button>
              )}
            </form.Subscribe>
          </form>

          <Link
            to="/carrito"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Volver al carrito
          </Link>
        </div>

        {/* Resumen del pedido */}
        <div className={`${cardClass} self-start`}>
          <h2 className="mb-4 text-xl font-semibold">
            Resumen del pedido
          </h2>

          {items.map((item) => (
            <div
              key={item.producto_id}
              className="flex justify-between gap-4 border-b border-gray-200 py-3 dark:border-slate-700"
            >
              <span>
                {item.cantidad} × {item.nombre}
              </span>

              <span className="font-medium">
                {formatoPrecio(
                  item.precio_unitario * item.cantidad
                )}
              </span>
            </div>
          ))}

          <div className="mt-4 flex justify-between text-xl font-bold">
            <span>Total estimado</span>
            <span>{formatoPrecio(total())}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;