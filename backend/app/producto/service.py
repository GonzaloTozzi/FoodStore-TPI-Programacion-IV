
from .model import Producto
from .schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class ProductoYaExiste(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class DatosProductoInvalidos(Exception):
    pass


class ProductoService:

    def _validar_nombre(
        self,
        uow: ProductoUnitOfWork,
        nombre: str,
        excluir_id: int | None = None,
    ) -> None:
        nombre_normalizado = nombre.strip().casefold()

        if not nombre_normalizado:
            raise DatosProductoInvalidos(
                "El nombre no puede estar vacío"
            )

        for producto in uow.productos.listar():
            if (
                producto.id != excluir_id
                and producto.nombre.strip().casefold()
                == nombre_normalizado
            ):
                raise ProductoYaExiste()

    def _validar_categoria(
        self,
        uow: ProductoUnitOfWork,
        categoria_id: int,
    ) -> None:
        categoria = uow.categorias.obtener_por_id(
            categoria_id
        )

        if categoria is None:
            raise CategoriaNoEncontrada()

    def crear(
        self,
        data: ProductoCreate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            self._validar_categoria(
                uow,
                data.categoria_id,
            )

            self._validar_nombre(
                uow,
                data.nombre,
            )

            producto = Producto(**data.model_dump())
            producto.nombre = producto.nombre.strip()

            uow.productos.crear(producto)

            return ProductoRead.model_validate(producto)

    def listar(self) -> list[ProductoRead]:
        with ProductoUnitOfWork() as uow:
            productos = uow.productos.listar()

            return [
                ProductoRead.model_validate(producto)
                for producto in productos
            ]

    
    def buscar_paginados(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:

        with ProductoUnitOfWork() as uow:
            productos, total = uow.productos.buscar_paginados(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            return ProductosPaginados(
                total=total,
                items=[
                    ProductoRead.model_validate(producto)
                    for producto in productos
                ],
            )


    def obtener_por_id(
        self,
        id: int,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.obtener_por_id(id)

            if producto is None:
                raise ProductoNoEncontrado()

            return ProductoRead.model_validate(producto)

    def listar_por_categoria(
        self,
        categoria_id: int,
    ) -> list[ProductoRead]:
        with ProductoUnitOfWork() as uow:
            self._validar_categoria(
                uow,
                categoria_id,
            )

            productos = uow.productos.listar_por_categoria(
                categoria_id
            )

            return [
                ProductoRead.model_validate(producto)
                for producto in productos
            ]

    def actualizar(
        self,
        id: int,
        data: ProductoUpdate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.obtener_por_id(id)

            if producto is None:
                raise ProductoNoEncontrado()

            cambios = data.model_dump(
                exclude_unset=True
            )

            if any(
                valor is None
                for valor in cambios.values()
            ):
                raise DatosProductoInvalidos(
                    "Los campos no pueden ser nulos"
                )

            if "categoria_id" in cambios:
                self._validar_categoria(
                    uow,
                    cambios["categoria_id"],
                )

            if "nombre" in cambios:
                self._validar_nombre(
                    uow,
                    cambios["nombre"],
                    excluir_id=id,
                )
                cambios["nombre"] = cambios[
                    "nombre"
                ].strip()

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)

            uow.productos.actualizar(producto)

            return ProductoRead.model_validate(producto)


    def actualizar_stock(
        self,
        id: int,
        data: ProductoStockUpdate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.obtener_por_id(id)

            if producto is None:
                raise ProductoNoEncontrado()

            producto.stock = data.stock
            producto.disponible = data.disponible

            uow.productos.actualizar(producto)

            return ProductoRead.model_validate(producto)


    def eliminar(self, id: int) -> bool:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.obtener_por_id(id)

            if producto is None:
                raise ProductoNoEncontrado()

            producto.activo = False

            uow.productos.actualizar(producto)

            return True
