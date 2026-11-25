from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository

from .model import Producto


class ProductoRepository(BaseRepository[Producto]):

    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def crear(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        return producto

    def listar(self) -> list[Producto]:
        statement = (
            select(Producto)
            .where(Producto.activo.is_(True)) 
            .order_by(Producto.id)
        )

        return list(self.session.exec(statement).all())

    def obtener_por_id(self, id: int) -> Producto | None:
        statement = select(Producto).where(
            Producto.id == id,
            Producto.activo.is_(True)
        )

        return self.session.exec(statement).first()

    def obtener_por_id_incluyendo_inactivos(
        self,
        id: int
    ) -> Producto | None:
        return self.session.get(Producto, id)

    def listar_por_categoria(
        self,
        categoria_id: int
    ) -> list[Producto]:
        statement = (
            select(Producto)
            .where(
                Producto.categoria_id == categoria_id,
                Producto.activo.is_(True)
            )
            .order_by(Producto.id)
        )

        return list(self.session.exec(statement).all())

    def actualizar(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        return producto


    def obtener_por_id_bloqueado(
        self,
        id: int
    ) -> Producto | None:
        statement = (
            select(Producto)
            .where(Producto.id == id)
            .with_for_update()
        )

        return self.session.exec(statement).first()


    def buscar_paginados(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[list[Producto], int]:

        filtros = [Producto.activo.is_(True)]

        if search and search.strip():
            filtros.append(
                Producto.nombre.ilike(
                    f"%{search.strip()}%"
                )
            )

        if categoria_id is not None:
            filtros.append(
                Producto.categoria_id == categoria_id
            )

        if disponible is not None:
            filtros.append(
                Producto.disponible.is_(disponible)
            )

        # Contar antes de aplicar la paginación.
        count_statement = (
            select(func.count(Producto.id))
            .where(*filtros)
        )

        total = self.session.exec(
            count_statement
        ).one()

        # Consultar únicamente los productos de la página.
        statement = (
            select(Producto)
            .where(*filtros)
            .options(selectinload(Producto.categoria))
            .order_by(Producto.id)
            .offset(skip)
            .limit(limit)
        )

        productos = list(
            self.session.exec(statement).all()
        )

        return productos, total
