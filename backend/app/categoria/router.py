
from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.core.dependencies import require_role

from .schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .service import (
    CategoriaNoEncontrada,
    CategoriaService,
    CategoriaYaExiste,
)

router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"],
)

@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["admin"]))],
)
def alta_categoria(categoria: CategoriaCreate):
    try:
        return CategoriaService().crear(categoria)

    except CategoriaYaExiste:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una categoría con ese nombre",
        )


@router.get(
    "",
    response_model=list[CategoriaRead],
)
def listar_categorias():
    return CategoriaService().listar()


@router.get(
    "/{id}",
    response_model=CategoriaRead,
)
def detalle_categoria(id: int = Path(gt=0)):
    try:
        return CategoriaService().obtener_por_id(id)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada",
        )


@router.put(
    "/{id}",
    response_model=CategoriaRead,
    dependencies=[Depends(require_role(["admin"]))],
)
def actualizar_categoria(
    categoria: CategoriaUpdate,
    id: int = Path(gt=0),
):
    try:
        return CategoriaService().actualizar(id, categoria)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada",
        )

    except CategoriaYaExiste:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una categoría con ese nombre",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role(["admin"]))],
)
def eliminar_categoria(id: int = Path(gt=0)):
    try:
        CategoriaService().eliminar(id)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=404,
            detail="Categoría no encontrada",
        )
