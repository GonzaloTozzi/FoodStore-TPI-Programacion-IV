
from .schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from .unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class CategoriaYaExiste(Exception):
    pass


class CategoriaService:

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        from .model import Categoria

        with CategoriaUnitOfWork() as uow:
            existente = uow.categorias.obtener_por_nombre(
                data.nombre
            )

            if existente is not None:
                raise CategoriaYaExiste()

            categoria = Categoria(**data.model_dump())

            uow.categorias.crear(categoria)

            return CategoriaRead.model_validate(categoria)

    def listar(self) -> list[CategoriaRead]:
        with CategoriaUnitOfWork() as uow:
            categorias = uow.categorias.listar()

            return [
                CategoriaRead.model_validate(categoria)
                for categoria in categorias
            ]

    def obtener_por_id(self, id: int) -> CategoriaRead:
        with CategoriaUnitOfWork() as uow:
            categoria = uow.categorias.obtener_por_id(id)

            if categoria is None:
                raise CategoriaNoEncontrada()

            return CategoriaRead.model_validate(categoria)

    def actualizar(
        self,
        id: int,
        data: CategoriaUpdate
    ) -> CategoriaRead:
        with CategoriaUnitOfWork() as uow:
            categoria = uow.categorias.obtener_por_id(id)

            if categoria is None:
                raise CategoriaNoEncontrada()

            cambios = data.model_dump(exclude_unset=True)

            if any(valor is None for valor in cambios.values()):
                raise ValueError(
                    "Los campos no pueden ser nulos"
                )

            if "nombre" in cambios:
                existente = uow.categorias.obtener_por_nombre(
                    cambios["nombre"]
                )

                if (
                    existente is not None
                    and existente.id != categoria.id
                ):
                    raise CategoriaYaExiste()

            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)

            uow.categorias.actualizar(categoria)

            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> bool:
        with CategoriaUnitOfWork() as uow:
            categoria = uow.categorias.obtener_por_id(id)

            if categoria is None:
                raise CategoriaNoEncontrada()

            categoria.activo = False

            uow.categorias.actualizar(categoria)

            return True
