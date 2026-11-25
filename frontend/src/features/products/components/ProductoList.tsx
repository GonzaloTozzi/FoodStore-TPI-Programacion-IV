import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import type { Producto } from "../types/producto";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

type ProductoListProps = {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onStock: (producto: Producto) => void;
  isAdmin: boolean;
};

function ProductoList({
  productos,
  onEdit,
  onDelete,
  onStock,
  isAdmin,
}: ProductoListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "categoria.nombre",
      header: "Categoría",
      cell: ({ row }) =>
        row.original.categoria?.nombre ?? "Sin categoría",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      accessorKey: "precio_base",
      header: "Precio base",
      cell: ({ row }) =>
        row.original.precio_base.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "disponible",
      header: "Disponible",
      cell: ({ row }) =>
        row.original.disponible ? "Sí" : "No",
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-400"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onStock(row.original)}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Stock
          </button>

          <button
            type="button"
            onClick={() => onDelete(row.original.id)}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  // Ocultar acciones a usuarios comunes
  const columnasVisibles = isAdmin
    ? columns
    : columns.filter((column) => column.id !== "acciones");

  const table = useReactTable({
    data: productos,
    columns: columnasVisibles,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (productos.length === 0) {
    return (
      <EstadoMensaje
        tipo="vacio"
        mensaje="No hay productos registrados."
      />
    );
  }

  return (
    <div>
      {/* Tabla de productos */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 dark:bg-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-4 py-3 font-semibold text-gray-700 dark:text-slate-100 ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[
                      header.column.getIsSorted() as string
                    ] ?? null}
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
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-gray-700 dark:text-slate-200"
                  >
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
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-slate-300">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoList;