
from datetime import datetime
from typing import Literal

from pydantic import (
    AliasChoices,
    ConfigDict,
    Field,
    field_validator,
)
from sqlmodel import SQLModel

EstadoPedido = Literal[
    "PENDIENTE",
    "EN_PREPARACION",
    "ENTREGADO",
    "CANCELADO",
]

FormaPago = Literal[
    "EFECTIVO",
    "TRANSFERENCIA",
]


class DetallePedidoCreate(SQLModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(ge=1)


class PedidoCreate(SQLModel):
    forma_pago: FormaPago

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
    )

    notas: str = ""

    detalles: list[DetallePedidoCreate] = Field(
        min_length=1,
        validation_alias=AliasChoices("items", "detalles"),
        serialization_alias="items",
    )

    @field_validator("detalles")
    @classmethod
    def validar_productos_repetidos(cls, detalles):
        ids = [
            detalle.producto_id
            for detalle in detalles
        ]

        if len(ids) != len(set(ids)):
            raise ValueError(
                "No se puede repetir un producto "
                "en el mismo pedido"
            )

        return detalles


class PedidoUpdate(SQLModel):
    estado: EstadoPedido


class DetallePedidoRead(SQLModel):
    producto_id: int
    nombre_producto: str
    precio_unitario: float
    cantidad: int
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class PedidoRead(SQLModel):
    id: int
    usuario_id: int
    estado: EstadoPedido
    forma_pago: FormaPago
    direccion_entrega: str
    notas: str | None
    total: float
    created_at: datetime
    updated_at: datetime

    detalles: list[DetallePedidoRead] = Field(
        default_factory=list,
        validation_alias=AliasChoices("items", "detalles"),
        serialization_alias="items",
    )

    model_config = ConfigDict(from_attributes=True)


class PedidosPaginados(SQLModel):
    total: int
    items: list[PedidoRead]


class ResumenPedidos(SQLModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: float
