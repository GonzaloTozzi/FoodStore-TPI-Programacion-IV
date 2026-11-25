import type { EstadoPedido } from "@/features/pedidos/types/pedido";

const etiquetas: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const estilos: Record<EstadoPedido, string> = {
  PENDIENTE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  EN_PREPARACION:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  ENTREGADO:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  CANCELADO:
    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};

function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  );
}

export default BadgeEstado;