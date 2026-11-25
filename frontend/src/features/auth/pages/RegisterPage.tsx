import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../hooks/useAuth";
import type { RegisterData } from "../types/auth.types";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setError(null);

      const data: RegisterData = {
        username: value.username.trim(),
        full_name: value.full_name.trim(),
        email: value.email.trim(),
        password: value.password,
      };

      try {
        await register(data);

        navigate("/login", { replace: true });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const detail = err.response?.data?.detail;

          if (err.response?.status === 409) {
            setError(
              typeof detail === "string"
                ? detail
                : "El usuario o email ya está registrado."
            );
          } else if (err.response?.status === 422) {
            setError("Revisá los datos ingresados.");
          } else {
            setError(
              typeof detail === "string"
                ? detail
                : "No se pudo completar el registro."
            );
          }
        } else {
          setError("Ocurrió un error inesperado.");
        }
      }
    },
  });

  const inputClass =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 " +
    "text-gray-900 outline-none focus:border-blue-500 " +
    "dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 " +
    "dark:focus:border-blue-400";

  const labelClass =
    "mb-2 block font-medium text-gray-700 dark:text-slate-200";

  const errorClass =
    "mt-1 text-sm text-red-600 dark:text-red-400";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md transition-colors duration-200 dark:border dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">

        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-slate-100">
          Crear cuenta
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {/* Nombre de usuario */}
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
                  className={labelClass}
                >
                  Nombre de usuario
                </label>

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Nombre completo */}
          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) =>
                !value.trim()
                  ? "El nombre completo es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor="full_name"
                  className={labelClass}
                >
                  Nombre completo
                </label>

                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value.trim()
                  ? "El email es obligatorio"
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                    ? "Ingresá un email válido"
                    : undefined,
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
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
                value.length < 8
                  ? "La contraseña debe tener al menos 8 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className={labelClass}
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className={errorClass}>
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Error del backend */}
          {error && (
            <p
              role="alert"
              className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {/* Botón de registro */}
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isSubmitting
                  ? "Registrando..."
                  : "Registrarse"}
              </button>
            )}
          </form.Subscribe>
        </form>

        {/* Enlace al login */}
        <p className="mt-5 text-center text-sm text-gray-600 dark:text-slate-300">
          ¿Ya tenés una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;