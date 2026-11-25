import type { Categoria } from '../types/categoria';

type CategoriaCardProps = {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
};

function CategoriaCard({
  categoria,
  onEdit,
  onDelete,
}: CategoriaCardProps) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-md">
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        {categoria.nombre}
      </h3>

      <p className="mb-4 text-gray-600">
        {categoria.descripcion}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(categoria)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(categoria.id)}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default CategoriaCard;