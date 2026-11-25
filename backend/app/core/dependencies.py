
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import verificar_access_token
from app.usuarios.models import Usuario
from app.usuarios.repository import UsuarioRepository


def get_current_user(
    access_token: Annotated[
        str | None,
        Cookie()
    ] = None,
    session: Session = Depends(get_session),
) -> Usuario:

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
        )

    usuario_id = verificar_access_token(access_token)

    repository = UsuarioRepository(session)
    usuario = repository.obtener_por_id(usuario_id)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )

    return usuario



def get_current_active_user(
    usuario: Usuario = Depends(get_current_user),
) -> Usuario:

    if usuario.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return usuario


def require_role(roles: list[str]):

    def verificar_rol(
        usuario: Usuario = Depends(get_current_active_user),
    ) -> Usuario:

        if usuario.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta acciÃ³n",
            )

        return usuario

    return verificar_rol
