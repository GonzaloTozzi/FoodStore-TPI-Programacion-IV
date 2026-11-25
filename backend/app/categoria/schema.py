
from pydantic import BaseModel, ConfigDict, Field


class CategoriaBase(BaseModel):
    nombre: str = Field(
        min_length=2,
        max_length=100
    )
    descripcion: str = ""


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    descripcion: str | None = None


class CategoriaRead(CategoriaBase):
    id: int
    activo: bool

    model_config = ConfigDict(from_attributes=True)
