import type { Producto } from "../types/producto";

type ProductoCardProps = {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
};

function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const puedeComprar = producto.disponible && producto.stock > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">

      {/* Imagen */}
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-400">
          Sin imagen
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">

        {/* Categoría */}
        <span className="text-sm text-blue-600 dark:text-blue-400">
          {producto.categoria?.nombre ?? "Sin categoría"}
        </span>

        {/* Nombre y descripción */}
        <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
          {producto.nombre}
        </h2>

        <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-slate-400">
          {producto.descripcion}
        </p>

        {/* Precio */}
        <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {producto.precio_base.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>

        {/* Disponibilidad */}
        <p className={`mt-1 text-sm ${
          puedeComprar
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}>
          {puedeComprar ? "Disponible" : "No disponible"}
        </p>

        {/* Agregar al carrito */}
        <button
          type="button"
          disabled={!puedeComprar}
          onClick={() => onAgregar(producto)}
          className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;