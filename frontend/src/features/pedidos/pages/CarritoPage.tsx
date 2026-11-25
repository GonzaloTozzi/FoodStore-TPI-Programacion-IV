import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

function CarritoPage() {
  const { items, quitar, cambiarCantidad, vaciar, total } =
    useCartStore();

  const formatoPrecio = (precio: number) =>
    precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const buttonClass =
    "rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 " +
    "disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Mi carrito
      </h1>

      {items.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow-sm dark:bg-slate-800">
          <p className="mb-4 text-gray-600 dark:text-slate-400">
            Tu carrito está vacío.
          </p>

          <Link
            to="/"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Precio unitario</th>
                  <th className="p-4">Cantidad</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.producto_id}
                    className="border-t border-gray-200 dark:border-slate-700"
                  >
                    <td className="p-4 font-medium">
                      {item.nombre}
                    </td>

                    <td className="p-4">
                      {formatoPrecio(item.precio_unitario)}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={item.cantidad <= 1}
                          onClick={() =>
                            cambiarCantidad(
                              item.producto_id,
                              item.cantidad - 1
                            )
                          }
                          className={buttonClass}
                        >
                          −
                        </button>

                        <span>{item.cantidad}</span>

                        <button
                          type="button"
                          onClick={() =>
                            cambiarCantidad(
                              item.producto_id,
                              item.cantidad + 1
                            )
                          }
                          className={buttonClass}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-4 font-semibold">
                      {formatoPrecio(
                        item.precio_unitario * item.cantidad
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => quitar(item.producto_id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 dark:hover:bg-red-500"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold">
                {formatoPrecio(total())}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={vaciar}
                className="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
              >
                Vaciar carrito
              </button>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  Seguir comprando
                </Link>

                <Link
                  to="/checkout"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Confirmar pedido
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default CarritoPage;