
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository

from .model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):

    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def crear(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        return categoria

    def listar(self) -> list[Categoria]:
        statement = (
            select(Categoria)
            .where(Categoria.activo.is_(True))
            .order_by(Categoria.id)
        )

        return list(self.session.exec(statement).all())

    def obtener_por_id(self, id: int) -> Categoria | None:
        statement = select(Categoria).where(
            Categoria.id == id,
            Categoria.activo.is_(True)
        )

        return self.session.exec(statement).first()

    def obtener_por_nombre(
        self,
        nombre: str
    ) -> Categoria | None:
        statement = select(Categoria).where(
            Categoria.nombre == nombre
        )

        return self.session.exec(statement).first()

    def actualizar(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        return categoria
