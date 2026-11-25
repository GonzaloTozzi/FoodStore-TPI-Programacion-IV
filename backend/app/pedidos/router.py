
from typing import Literal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Query,
    status,
)

from app.core.dependencies import (
    get_current_active_user,
    require_role,
)
from app.usuarios.models import Usuario

from .schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    PedidoUpdate,
    ResumenPedidos,
)
from .service import (
    DatosPedidoInvalidos,
    EstadoPedidoInvalido,
    PedidoNoEncontrado,
    PedidoService,
    PedidoSinPermiso,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    StockInsuficiente,
)

router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"],
)


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    data: PedidoCreate,
    usuario: Usuario = Depends(get_current_active_user),
):
    try:
        return PedidoService().crear(
            data,
            usuario_id=usuario.id,
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Uno de los productos no existe o estÃ¡ inactivo",
        )

    except (ProductoNoDisponible, StockInsuficiente) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error) or "Producto no disponible o stock insuficiente",
        )

    except DatosPedidoInvalidos as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get(
    "",
    response_model=PedidosPaginados,
)
def listar_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: Literal[
        "PENDIENTE",
        "EN_PREPARACION",
        "ENTREGADO",
        "CANCELADO",
    ] | None = Query(default=None),
    usuario: Usuario = Depends(get_current_active_user),
):
    return PedidoService().buscar_paginados(
        usuario_id=None if usuario.role == "admin" else usuario.id,
        estado=estado,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/resumen",
    response_model=ResumenPedidos,
    dependencies=[Depends(require_role(["admin"]))],
)
def obtener_resumen_pedidos():
    return PedidoService().obtener_resumen()


@router.get(
    "/{id}",
    response_model=PedidoRead,
)
def obtener_pedido(
    id: int = Path(gt=0),
    usuario: Usuario = Depends(get_current_active_user),
):
    try:
        return PedidoService().obtener_por_id(
            pedido_id=id,
            usuario_id=usuario.id,
            es_admin=usuario.role == "admin",
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )

    except PedidoSinPermiso:
        raise HTTPException(
            status_code=403,
            detail="No tiene permisos para consultar este pedido",
        )


@router.patch(
    "/{id}/estado",
    response_model=PedidoRead,
    dependencies=[Depends(require_role(["admin"]))],
)
def cambiar_estado_pedido(
    data: PedidoUpdate,
    id: int = Path(gt=0),
    usuario: Usuario = Depends(get_current_active_user),
):
    try:
        return PedidoService().cambiar_estado(
            pedido_id=id,
            nuevo_estado=data.estado,
            usuario_id=usuario.id,
            es_admin=True,
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )

    except EstadoPedidoInvalido:
        raise HTTPException(
            status_code=400,
            detail="TransiciÃ³n de estado no permitida",
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto asociado al pedido no encontrado",
        )


@router.patch(
    "/{id}/cancelar",
    response_model=PedidoRead,
)
def cancelar_pedido(
    id: int = Path(gt=0),
    usuario: Usuario = Depends(get_current_active_user),
):
    try:
        return PedidoService().cambiar_estado(
            pedido_id=id,
            nuevo_estado="CANCELADO",
            usuario_id=usuario.id,
            es_admin=usuario.role == "admin",
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )

    except PedidoSinPermiso:
        raise HTTPException(
            status_code=403,
            detail="No tiene permisos para cancelar este pedido",
        )

    except EstadoPedidoInvalido:
        raise HTTPException(
            status_code=400,
            detail="El pedido no se puede cancelar en su estado actual",
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto asociado al pedido no encontrado",
        )
