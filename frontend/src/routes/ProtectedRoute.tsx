import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";
import type { Role } from "@/features/auth/types/auth.types";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Esperar mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-slate-300">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // Sin sesión: redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sesión válida, pero sin el rol necesario
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuario autenticado y autorizado
  return <Outlet />;
}

export default ProtectedRoute;