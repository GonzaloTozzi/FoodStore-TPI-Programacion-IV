
from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.categoria.schema import CategoriaRead


class ProductoBase(SQLModel):
    categoria_id: int = Field(gt=0)
    nombre: str = Field(min_length=1)
    descripcion: str = ""
    precio_base: float = Field(ge=0)
    imagen_url: str = ""
    stock: int = Field(default=0, ge=0)
    disponible: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(SQLModel):
    categoria_id: int | None = Field(default=None, gt=0)
    nombre: str | None = Field(default=None, min_length=1)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0)
    imagen_url: str | None = None
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None


class ProductoStockUpdate(SQLModel):
    stock: int = Field(ge=0)
    disponible: bool


class ProductoRead(ProductoBase):
    id: int
    activo: bool
    categoria: CategoriaRead

    model_config = ConfigDict(from_attributes=True)


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
