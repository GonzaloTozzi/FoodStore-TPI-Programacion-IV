import { Navigate, Route, Routes } from "react-router-dom";

import {
  LoginPage,
  RegisterPage,
  AdminUsersPage,
} from "@/features/auth";

import { CategoriasPage } from "@/features/categories";
import { ProductsPage } from "@/features/products";

import CatalogoPage from "@/features/products/pages/CatalogoPage";
import CarritoPage from "@/features/pedidos/pages/CarritoPage";
import CheckoutPage from "@/features/pedidos/pages/CheckOutPage";
import MisPedidosPage from "@/features/pedidos/pages/MisPedidosPage";
import AdminPedidosPage from "@/features/pedidos/pages/AdminPedidosPage";
import AdminResumenPage from "@/features/pedidos/pages/AdminResumenPage";

import Navbar from "@/shared/components/Navbar";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<CatalogoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
        </Route>

        {/* Rutas exclusivas del administrador */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/resumen" element={<AdminResumenPage />} />
          <Route path="/admin/categorias" element={<CategoriasPage />} />
          <Route path="/admin/productos" element={<ProductsPage />} />
          <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
          <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        </Route>

        {/* Rutas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default AppRouter;