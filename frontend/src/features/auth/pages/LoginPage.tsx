import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        await login(value.username.trim(), value.password);
        navigate("/", { replace: true });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const detail = err.response?.data?.detail;

          setError(
            typeof detail === "string"
              ? detail
              : "No se pudo iniciar sesión."
          );
        } else {
          setError("Ocurrió un error inesperado.");
        }
      }
    },
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md transition-colors duration-200 dark:border dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">

        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-slate-100">
          Iniciar sesión
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {/* Usuario */}
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                !value.trim()
                  ? "El usuario es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="mb-2 block font-medium text-gray-700 dark:text-slate-200"
                >
                  Usuario
                </label>

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-blue-400"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Contraseña */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "La contraseña es obligatoria"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block font-medium text-gray-700 dark:text-slate-200"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-blue-400"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Error de autenticación */}
          {error && (
            <p
              role="alert"
              className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {/* Botón ingresar */}
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting || isLoading}
                className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isSubmitting || isLoading
                  ? "Ingresando..."
                  : "Iniciar sesión"}
              </button>
            )}
          </form.Subscribe>
        </form>

        {/* Registro */}
        <p className="mt-5 text-center text-sm text-gray-600 dark:text-slate-300">
          ¿No tenés una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;