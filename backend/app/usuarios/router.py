
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.core.database import get_session
from app.core.dependencies import (
    get_current_active_user,
    require_role,
)
from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    crear_access_token,
    verificar_password,
)

from .models import Usuario
from .repository import UsuarioRepository
from .schemas import UserAdmin, UserCreate, UserPublic
from .service import (
    EmailYaRegistrado,
    UsernameYaRegistrado,
    UsuarioNoEncontrado,
    UsuarioService,
)

# Rutas públicas de autenticación
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Autenticacion"],
)

# Rutas administrativas de usuarios
admin_router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Administración de usuarios"],
)


# ============================================================
# AUTENTICACIÓN
# ============================================================

@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def registrar_usuario(data: UserCreate):
    service = UsuarioService()

    try:
        return service.registrar(data)

    except EmailYaRegistrado:
        raise HTTPException(
            status_code=409,
            detail="El email ya está registrado",
        )

    except UsernameYaRegistrado:
        raise HTTPException(
            status_code=409,
            detail="El username ya está registrado",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        )


@router.post("/token")
def iniciar_sesion(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    repository = UsuarioRepository(session)

    username = form_data.username.strip().lower()

    usuario = repository.obtener_por_username(username)

    if usuario is None or not verificar_password(
        form_data.password,
        usuario.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos",
        )

    if usuario.disabled:
        raise HTTPException(
            status_code=400,
            detail="Cuenta de usuario desactivada",
        )

    token = crear_access_token(usuario.id)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {
        "message": "Inicio de sesión exitoso"
    }


@router.post("/logout")
def cerrar_sesion(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="lax",
    )

    return {
        "message": "Sesión cerrada correctamente"
    }


@router.get(
    "/me",
    response_model=UserPublic,
)
def obtener_mi_perfil(
    usuario: Usuario = Depends(get_current_active_user),
):
    return UserPublic.model_validate(usuario)


# ============================================================
# ADMINISTRACIÓN DE USUARIOS
# ============================================================

@admin_router.get(
    "/usuarios",
    response_model=list[UserAdmin],
)
def listar_usuarios(
    admin: Usuario = Depends(require_role(["admin"])),
):
    service = UsuarioService()
    return service.listar_usuarios()


@admin_router.post(
    "/usuarios/{id}/activar",
    response_model=UserAdmin,
)
def activar_usuario(
    id: int = Path(gt=0),
    admin: Usuario = Depends(require_role(["admin"])),
):
    service = UsuarioService()

    try:
        return service.cambiar_estado(
            usuario_id=id,
            activar=True,
        )

    except UsuarioNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )


@admin_router.post(
    "/usuarios/{id}/desactivar",
    response_model=UserAdmin,
)
def desactivar_usuario(
    id: int = Path(gt=0),
    admin: Usuario = Depends(require_role(["admin"])),
):
    if id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="No puedes desactivar tu propia cuenta",
        )

    service = UsuarioService()

    try:
        return service.cambiar_estado(
            usuario_id=id,
            activar=False,
        )

    except UsuarioNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )
