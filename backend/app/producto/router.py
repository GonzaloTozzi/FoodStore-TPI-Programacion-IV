
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Query,
    status,
)

from app.core.dependencies import require_role

from .schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .service import (
    CategoriaNoEncontrada,
    DatosProductoInvalidos,
    ProductoNoEncontrado,
    ProductoService,
    ProductoYaExiste,
)

router = APIRouter(
    prefix="/productos",
    tags=["Productos"],
)


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["admin"]))],
)
def alta_producto(producto: ProductoCreate):
    try:
        return ProductoService().crear(producto)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada o inactiva",
        )

    except ProductoYaExiste:
        raise HTTPException(
            status_code=409,
            detail="Ya existe un producto con ese nombre",
        )

    except DatosProductoInvalidos as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        )


@router.get(
    "",
    response_model=ProductosPaginados,
)
def listar_productos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    categoria_id: int | None = Query(default=None, gt=0),
    disponible: bool | None = Query(default=None),
):
    return ProductoService().buscar_paginados(
        skip=skip,
        limit=limit,
        search=search,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get(
    "/categoria/{categoria_id}",
    response_model=list[ProductoRead],
)
def listar_productos_por_categoria(
    categoria_id: int = Path(gt=0),
):
    try:
        return ProductoService().listar_por_categoria(
            categoria_id
        )

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada o inactiva",
        )



@router.patch(
    "/{id}/stock",
    response_model=ProductoRead,
    dependencies=[Depends(require_role(["admin"]))],
)
def actualizar_stock_producto(
    data: ProductoStockUpdate,
    id: int = Path(gt=0),
):
    try:
        return ProductoService().actualizar_stock(
            id,
            data,
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado",
        )


@router.get(
    "/{id}",
    response_model=ProductoRead,
)
def detalle_producto(id: int = Path(gt=0)):
    try:
        return ProductoService().obtener_por_id(id)

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado",
        )


@router.put(
    "/{id}",
    response_model=ProductoRead,
    dependencies=[Depends(require_role(["admin"]))],
)
def actualizar_producto(
    producto: ProductoUpdate,
    id: int = Path(gt=0),
):
    try:
        return ProductoService().actualizar(
            id,
            producto,
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado",
        )

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada o inactiva",
        )

    except ProductoYaExiste:
        raise HTTPException(
            status_code=409,
            detail="Ya existe un producto con ese nombre",
        )

    except DatosProductoInvalidos as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role(["admin"]))],
)
def eliminar_producto(id: int = Path(gt=0)):
    try:
        ProductoService().eliminar(id)

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado",
        )
