import { useState } from "react";
import axios from "axios";

import {
  usePedidos,
  usePedido,
  useCancelarPedido,
} from "../hooks/usePedidos";

import PedidoDetalle from "../components/PedidoDetalle";
import BadgeEstado from "@/shared/ui/BadgeEstado";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

function MisPedidosPage() {
  const [pedidoId, setPedidoId] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const pedidosQuery = usePedidos({
    skip: pagina * limit,
    limit,
  });

  const detalleQuery = usePedido(pedidoId);
  const cancelarMutation = useCancelarPedido();

  const pedidos = pedidosQuery.data?.items ?? [];
  const totalPaginas = Math.ceil(
    (pedidosQuery.data?.total ?? 0) / limit
  );

  const formatoPrecio = (precio: number) =>
    precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const handleCancelar = async (id: number) => {
    if (!window.confirm("¿Querés cancelar este pedido?")) return;

    setError(null);

    try {
      await cancelarMutation.mutateAsync(id);
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail
        : null;

      setError(
        typeof detail === "string"
          ? detail
          : "No se pudo cancelar el pedido."
      );
    }
  };

  const buttonClass =
    "rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 " +
    "disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Mis pedidos
      </h1>

      {pedidosQuery.isLoading && (
        <EstadoMensaje
          tipo="carga"
          mensaje="Cargando pedidos..."
        />
      )}

      {pedidosQuery.isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="No se pudieron cargar los pedidos."
        />
      )}

      {pedidosQuery.isSuccess && pedidos.length === 0 && (
        <EstadoMensaje
          tipo="vacio"
          mensaje="Todavía no realizaste ningún pedido."
        />
      )}

      {error && (
        <div className="mb-4">
          <EstadoMensaje tipo="error" mensaje={error} />
        </div>
      )}

      {pedidosQuery.isSuccess && pedidos.length > 0 && (
        <>
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">
                    Pedido #{pedido.id}
                  </h2>

                  <BadgeEstado estado={pedido.estado} />
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-slate-300">
                  <p>
                    Fecha:{" "}
                    {new Date(pedido.created_at).toLocaleString("es-AR")}
                  </p>

                  <p>Dirección: {pedido.direccion_entrega}</p>

                  <p>
                    Forma de pago:{" "}
                    {pedido.forma_pago === "EFECTIVO"
                      ? "Efectivo"
                      : "Transferencia"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xl font-bold">
                    {formatoPrecio(pedido.total)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPedidoId(pedido.id)}
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Ver detalle
                    </button>

                    {pedido.estado === "PENDIENTE" && (
                      <button
                        type="button"
                        disabled={cancelarMutation.isPending}
                        onClick={() => void handleCancelar(pedido.id)}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 dark:hover:bg-red-500"
                      >
                        Cancelar pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={pagina === 0}
              onClick={() => setPagina((prev) => prev - 1)}
              className={buttonClass}
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
              className={buttonClass}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Detalle del pedido */}
      {pedidoId > 0 && detalleQuery.isLoading && (
        <EstadoMensaje
          tipo="carga"
          mensaje="Cargando detalle..."
        />
      )}

      {pedidoId > 0 && detalleQuery.isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="No se pudo cargar el detalle."
        />
      )}

      {pedidoId > 0 && detalleQuery.data && (
        <PedidoDetalle
          pedido={detalleQuery.data}
          onClose={() => setPedidoId(0)}
        />
      )}
    </main>
  );
}

export default MisPedidosPage;