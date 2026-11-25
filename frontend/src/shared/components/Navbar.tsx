import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/features/auth";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "@/shared/components/ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLoading } = useAuth();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const cantidadCarrito = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.cantidad, 0)
  );

  const handleLogout = async () => {
    setCerrandoSesion(true);

    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setCerrandoSesion(false);
      navigate("/login", { replace: true });
    }
  };

  const linkClass =
    "font-medium text-white transition-colors " +
    "hover:text-blue-200 dark:hover:text-blue-300";

  return (
    <nav className="bg-blue-600 px-6 py-4 shadow-md transition-colors duration-200 dark:border-b dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">

        <Link to="/" className="text-2xl font-bold text-white">
          Food Store
        </Link>

        {/* Navegación pública y del cliente */}
        <div className="flex flex-wrap items-center gap-5">
          <Link to="/" className={linkClass}>
            Catálogo
          </Link>

          <Link to="/carrito" className={linkClass}>
            Carrito ({cantidadCarrito})
          </Link>

          {!isLoading && user && (
            <Link to="/mis-pedidos" className={linkClass}>
              Mis pedidos
            </Link>
          )}
        </div>

        {/* Usuario, autenticación y tema */}
        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle />

          {!isLoading && (
            user ? (
              <>
                <div className="text-right text-white">
                  <p className="text-sm font-semibold">
                    {user.full_name}
                  </p>

                  <p className="text-xs text-blue-100 dark:text-slate-300">
                    {user.role === "admin" ? "Administrador" : "Cliente"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={cerrandoSesion}
                  className="rounded bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  {cerrandoSesion ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  className="rounded bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Registrarse
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {/* Navegación administrativa */}
      {!isLoading && isAdmin && (
        <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center gap-6 border-t border-blue-400 pt-3 dark:border-slate-700">
          <span className="text-sm font-semibold text-blue-100 dark:text-slate-400">
            Administración:
          </span>

          <Link to="/admin/resumen" className={linkClass}>
            Resumen
          </Link>

          <Link to="/admin/categorias" className={linkClass}>
            Categorías
          </Link>

          <Link to="/admin/productos" className={linkClass}>
            Productos
          </Link>

          <Link to="/admin/pedidos" className={linkClass}>
            Pedidos
          </Link>

          <Link to="/admin/usuarios" className={linkClass}>
            Usuarios
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;