import { useResumenPedidos } from "../hooks/usePedidos";
import EstadoMensaje from "@/shared/components/EstadoMensaje";

function AdminResumenPage() {
  const { data, isLoading, isError } = useResumenPedidos();

  if (isLoading) {
    return <EstadoMensaje tipo="carga" mensaje="Cargando resumen..." />;
  }

  if (isError || !data) {
    return <EstadoMensaje tipo="error" mensaje="Error al cargar el resumen." />;
  }

  const indicadores = [
    {
      titulo: "Pedidos pendientes",
      valor: data.pendientes,
      estilo: "text-yellow-600 dark:text-yellow-400",
    },
    {
      titulo: "En preparación",
      valor: data.en_preparacion,
      estilo: "text-blue-600 dark:text-blue-400",
    },
    {
      titulo: "Pedidos entregados",
      valor: data.entregados,
      estilo: "text-green-600 dark:text-green-400",
    },
    {
      titulo: "Pedidos cancelados",
      valor: data.cancelados,
      estilo: "text-red-600 dark:text-red-400",
    },
    {
      titulo: "Pedidos de hoy",
      valor: data.pedidos_hoy,
      estilo: "text-purple-600 dark:text-purple-400",
    },
    {
      titulo: "Ingresos por pedidos entregados",
      valor: data.ingresos_entregados.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      estilo: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">
        Resumen administrativo
      </h1>

      <p className="mb-6 text-gray-600 dark:text-slate-400">
        Indicadores generales de Food Store.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {indicadores.map((indicador) => (
          <div
            key={indicador.titulo}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h2 className="mb-3 font-medium text-gray-600 dark:text-slate-300">
              {indicador.titulo}
            </h2>

            <p className={`text-3xl font-bold ${indicador.estilo}`}>
              {indicador.valor}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminResumenPage;