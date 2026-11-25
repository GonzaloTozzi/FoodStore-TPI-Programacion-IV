
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository

from .models import Usuario


class UsuarioRepository(BaseRepository[Usuario]):

    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def crear(self, usuario: Usuario) -> Usuario:
        self.session.add(usuario)
        self.session.flush()
        return usuario

    def obtener_por_email(self, email: str) -> Usuario | None:
        statement = select(Usuario).where(
            Usuario.email == email
        )
        return self.session.exec(statement).first()

    def obtener_por_username(self, username: str) -> Usuario | None:
        statement = select(Usuario).where(
            Usuario.username == username
        )
        return self.session.exec(statement).first()

    def obtener_por_id(self, id: int) -> Usuario | None:
        return self.session.get(Usuario, id)

    def listar(self) -> list[Usuario]:
        statement = select(Usuario).order_by(Usuario.id)
        return list(self.session.exec(statement).all())

    def actualizar(self, usuario: Usuario) -> Usuario:
        self.session.add(usuario)
        self.session.flush()
        return usuario
