
import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-md transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">

        {/* Icono de acceso denegado */}
        <div className="mb-4 text-5xl">
          🔒
        </div>

        {/* Título */}
        <h1 className="mb-3 text-2xl font-bold text-red-600 dark:text-red-400">
          Acceso denegado
        </h1>

        {/* Mensaje */}
        <p className="mb-6 text-gray-600 dark:text-slate-300">
          No tenés los permisos necesarios para acceder
          a esta página.
        </p>

        {/* Volver a categorías */}
        <Link
          to="/categories"
          className="inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Volver a categorías
        </Link>

      </div>
    </main>
  );
}

export default UnauthorizedPage;
