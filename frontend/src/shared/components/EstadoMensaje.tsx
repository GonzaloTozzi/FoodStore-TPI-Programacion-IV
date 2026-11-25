
type EstadoMensajeProps = {
  tipo: "carga" | "vacio" | "error";
  mensaje: string;
};

function EstadoMensaje({ tipo, mensaje }: EstadoMensajeProps) {
  const estilos = {
    carga:
      "bg-blue-50 text-blue-700 border-blue-200 " +
      "dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",

    vacio:
      "bg-gray-50 text-gray-600 border-gray-200 " +
      "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",

    error:
      "bg-red-50 text-red-700 border-red-200 " +
      "dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
  };

  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-lg border p-4 transition-colors duration-200 ${estilos[tipo]}`}
    >
      <p>{mensaje}</p>
    </div>
  );
}

export default EstadoMensaje;
