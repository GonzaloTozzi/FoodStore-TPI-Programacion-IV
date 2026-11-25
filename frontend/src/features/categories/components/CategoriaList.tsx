
import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import type { Categoria } from "../types/categoria";

type CategoriaListProps = {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
};

function CategoriaList({
  categorias,
  onEdit,
  onDelete,
  isAdmin,
}: CategoriaListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(row.original.id)}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  // Ocultar la columna Acciones a usuarios comunes
  const columnasVisibles = isAdmin
    ? columns
    : columns.filter((column) => column.id !== "acciones");

  const table = useReactTable({
    data: categorias,
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

  if (categorias.length === 0) {
    return (
      <p className="rounded bg-gray-100 p-4 text-gray-600 dark:bg-slate-800 dark:text-slate-300">
        No hay categorías registradas.
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md transition-colors duration-200 dark:bg-slate-800 dark:shadow-black/20">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-semibold text-gray-800 dark:text-slate-100"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "cursor-default"
                        }
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
                        ] ?? ""}
                      </button>
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
                className="border-t border-gray-200 dark:border-slate-700 dark:hover:bg-slate-700/50"
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
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoriaList;
