import type { Pedido } from "../types/pedido";
import BadgeEstado from "@/shared/ui/BadgeEstado";

type PedidoDetalleProps = {
  pedido: Pedido;
  onClose: () => void;
};

function PedidoDetalle({ pedido, onClose }: PedidoDetalleProps) {
  const formatoPrecio = (precio: number) =>
    precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800 dark:text-slate-100">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Pedido #{pedido.id}
          </h2>
          <BadgeEstado estado={pedido.estado} />
        </div>

        {/* Datos del pedido */}
        <div className="mb-6 space-y-2 text-sm">
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(pedido.created_at).toLocaleString("es-AR")}
          </p>

          <p>
            <strong>Dirección:</strong> {pedido.direccion_entrega}
          </p>

          <p>
            <strong>Forma de pago:</strong>{" "}
            {pedido.forma_pago === "EFECTIVO"
              ? "Efectivo"
              : "Transferencia"}
          </p>

          <p>
            <strong>Notas:</strong> {pedido.notas || "Sin notas"}
          </p>
        </div>

        {/* Productos del pedido */}
        <h3 className="mb-3 text-lg font-semibold">
          Productos
        </h3>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Precio unitario</th>
                <th className="p-3">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedido.items.map((item) => (
                <tr
                  key={item.producto_id}
                  className="border-t border-gray-200 dark:border-slate-700"
                >
                  <td className="p-3">{item.nombre_producto}</td>
                  <td className="p-3">{item.cantidad}</td>
                  <td className="p-3">
                    {formatoPrecio(item.precio_unitario)}
                  </td>
                  <td className="p-3">
                    {formatoPrecio(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold dark:border-slate-700">
          <span>Total</span>
          <span>{formatoPrecio(pedido.total)}</span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoDetalle;