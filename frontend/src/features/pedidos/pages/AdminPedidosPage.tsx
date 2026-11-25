import { useState } from "react";
import axios from "axios";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  usePedidos,
  usePedido,
  useCambiarEstadoPedido,
} from "../hooks/usePedidos";

import type { Pedido, EstadoPedido } from "../types/pedido";

import PedidoDetalle from "../components/PedidoDetalle";
import BadgeEstado from "@/shared/ui/BadgeEstado";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

function AdminPedidosPage() {
  const [estado, setEstado] = useState<EstadoPedido | "">("");
  const [pagina, setPagina] = useState(0);
  const [pedidoId, setPedidoId] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const pedidosQuery = usePedidos({
    skip: pagina * limit,
    limit,
    estado: estado || undefined,
  });

  const detalleQuery = usePedido(pedidoId);
  const cambiarMutation = useCambiarEstadoPedido();

  const pedidos = pedidosQuery.data?.items ?? [];
  const totalPaginas = Math.ceil(
    (pedidosQuery.data?.total ?? 0) / limit
  );

  const formatoPrecio = (precio: number) =>
    precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const handleCambiarEstado = async (
    id: number,
    nuevoEstado: EstadoPedido
  ) => {
    if (
      nuevoEstado === "CANCELADO" &&
      !window.confirm("¿Querés cancelar este pedido?")
    ) {
      return;
    }

    setError(null);

    try {
      await cambiarMutation.mutateAsync({
        id,
        data: { estado: nuevoEstado },
      });
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail
        : null;

      setError(
        typeof detail === "string"
          ? detail
          : "No se pudo cambiar el estado del pedido."
      );
    }
  };

  const buttonClass =
    "rounded px-3 py-1 text-sm text-white disabled:opacity-50";

  const columns: ColumnDef<Pedido>[] = [
    {
      accessorKey: "id",
      header: "Pedido",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "usuario_id",
      header: "Usuario",
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleString("es-AR"),
    },
    {
      accessorKey: "forma_pago",
      header: "Pago",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => formatoPrecio(row.original.total),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <BadgeEstado estado={row.original.estado} />
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const pedido = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPedidoId(pedido.id)}
              className={`${buttonClass} bg-gray-600 hover:bg-gray-700 dark:bg-slate-600 dark:hover:bg-slate-500`}
            >
              Detalle
            </button>

            {pedido.estado === "PENDIENTE" && (
              <button
                disabled={cambiarMutation.isPending}
                onClick={() =>
                  void handleCambiarEstado(
                    pedido.id,
                    "EN_PREPARACION"
                  )
                }
                className={`${buttonClass} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`}
              >
                Preparar
              </button>
            )}

            {pedido.estado === "EN_PREPARACION" && (
              <button
                disabled={cambiarMutation.isPending}
                onClick={() =>
                  void handleCambiarEstado(
                    pedido.id,
                    "ENTREGADO"
                  )
                }
                className={`${buttonClass} bg-green-600 hover:bg-green-700 dark:hover:bg-green-500`}
              >
                Entregar
              </button>
            )}

            {(pedido.estado === "PENDIENTE" ||
              pedido.estado === "EN_PREPARACION") && (
              <button
                disabled={cambiarMutation.isPending}
                onClick={() =>
                  void handleCambiarEstado(
                    pedido.id,
                    "CANCELADO"
                  )
                }
                className={`${buttonClass} bg-red-600 hover:bg-red-700 dark:hover:bg-red-500`}
              >
                Cancelar
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (pedido) => String(pedido.id),
  });

  const paginationClass =
    "rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 " +
    "disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Administración de pedidos
      </h1>

      {/* Filtro por estado */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="estado">Filtrar por estado:</label>

        <select
          id="estado"
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value as EstadoPedido | "");
            setPagina(0);
          }}
          className="rounded border border-gray-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="EN_PREPARACION">En preparación</option>
          <option value="ENTREGADO">Entregados</option>
          <option value="CANCELADO">Cancelados</option>
        </select>
      </div>

      {error && (
        <div className="mb-4">
          <EstadoMensaje tipo="error" mensaje={error} />
        </div>
      )}

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
          mensaje="No se encontraron pedidos."
        />
      )}

      {/* Tabla */}
      {pedidosQuery.isSuccess && pedidos.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th key={header.id} className="p-4">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((prev) => prev - 1)}
              className={paginationClass}
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {pagina + 1} de {totalPaginas}
            </span>

            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina((prev) => prev + 1)}
              className={paginationClass}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Detalle */}
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

export default AdminPedidosPage;