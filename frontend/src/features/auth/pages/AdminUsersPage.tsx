import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAuth } from "../hooks/useAuth";
import type { UsuarioAuth } from "../types/auth.types";

import EstadoMensaje from "@/shared/components/EstadoMensaje";

function AdminUsersPage() {
  const { user } = useAuth();

  const {
    usuariosQuery,
    activarMutation,
    desactivarMutation,
  } = useAdminUsers();

  const usuarios = usuariosQuery.data ?? [];

  const procesando =
    activarMutation.isPending || desactivarMutation.isPending;

  const columns: ColumnDef<UsuarioAuth>[] = [
    {
      accessorKey: "username",
      header: "Usuario",
    },
    {
      accessorKey: "full_name",
      header: "Nombre completo",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) =>
        row.original.role === "admin" ? "Administrador" : "Cliente",
    },
    {
      accessorKey: "disabled",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.original.disabled
              ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
              : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
          }`}
        >
          {row.original.disabled ? "Desactivado" : "Activo"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original;

        if (usuario.id === user?.id) {
          return (
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Mi cuenta
            </span>
          );
        }

        return usuario.disabled ? (
          <button
            type="button"
            disabled={procesando}
            onClick={() => activarMutation.mutate(usuario.id)}
            className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50 dark:hover:bg-green-500"
          >
            Activar
          </button>
        ) : (
          <button
            type="button"
            disabled={procesando}
            onClick={() => {
              if (window.confirm("¿Querés desactivar este usuario?")) {
                desactivarMutation.mutate(usuario.id);
              }
            }}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50 dark:hover:bg-red-500"
          >
            Desactivar
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (usuario) => String(usuario.id),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const paginationClass =
    "rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 " +
    "disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Administración de usuarios
      </h1>

      {usuariosQuery.isLoading && (
        <EstadoMensaje
          tipo="carga"
          mensaje="Cargando usuarios..."
        />
      )}

      {usuariosQuery.isError && (
        <EstadoMensaje
          tipo="error"
          mensaje="No se pudieron cargar los usuarios."
        />
      )}

      {usuariosQuery.isSuccess && usuarios.length === 0 && (
        <EstadoMensaje
          tipo="vacio"
          mensaje="No hay usuarios registrados."
        />
      )}

      {usuariosQuery.isSuccess && usuarios.length > 0 && (
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

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className={paginationClass}
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>

            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className={paginationClass}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default AdminUsersPage;