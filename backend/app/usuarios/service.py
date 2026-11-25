
import bcrypt

from .models import Usuario
from .schemas import UserAdmin, UserCreate, UserPublic
from .unit_of_work import UsuarioUnitOfWork


class EmailYaRegistrado(Exception):
    pass


class UsernameYaRegistrado(Exception):
    pass


class UsuarioNoEncontrado(Exception):
    pass


class UsuarioService:

    def registrar(self, data: UserCreate) -> UserPublic:
        with UsuarioUnitOfWork() as uow:

            username = data.username.strip().lower()
            full_name = data.full_name.strip()
            email = str(data.email).strip().lower()

            if not username:
                raise ValueError(
                    "El username no puede estar vacío"
                )

            if not full_name:
                raise ValueError(
                    "El nombre completo no puede estar vacío"
                )

            if uow.usuarios.obtener_por_username(username):
                raise UsernameYaRegistrado()

            if uow.usuarios.obtener_por_email(email):
                raise EmailYaRegistrado()

            hashed_password = bcrypt.hashpw(
                data.password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            usuario = Usuario(
                username=username,
                full_name=full_name,
                email=email,
                hashed_password=hashed_password,
                role="user",
                disabled=False,
            )

            uow.usuarios.crear(usuario)

            return UserPublic.model_validate(usuario)

    def listar_usuarios(self) -> list[UserAdmin]:
        with UsuarioUnitOfWork() as uow:

            usuarios = uow.usuarios.listar()

            return [
                UserAdmin.model_validate(usuario)
                for usuario in usuarios
            ]

    def cambiar_estado(
        self,
        usuario_id: int,
        activar: bool,
    ) -> UserAdmin:
        with UsuarioUnitOfWork() as uow:

            usuario = uow.usuarios.obtener_por_id(
                usuario_id
            )

            if usuario is None:
                raise UsuarioNoEncontrado()

            usuario.disabled = not activar

            uow.usuarios.actualizar(usuario)

            return UserAdmin.model_validate(usuario)
