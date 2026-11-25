
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository

from .models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session: Session):
        super().__init__(session, Pedido)


    def crear(self, pedido: Pedido) -> Pedido:
        self.session.add(pedido)
        self.session.flush()
        return pedido

    def listar(self) -> list[Pedido]:
        statement = (
            select(Pedido)
            .options(selectinload(Pedido.detalles))
            .order_by(Pedido.id)
        )

        return list(self.session.exec(statement).all())

    def listar_por_usuario(
        self,
        usuario_id: int
    ) -> list[Pedido]:
        statement = (
            select(Pedido)
            .where(Pedido.usuario_id == usuario_id)
            .options(selectinload(Pedido.detalles))
            .order_by(Pedido.id.desc())
        )

        return list(self.session.exec(statement).all())

    def obtener_por_id(self, id: int) -> Pedido | None:
        statement = (
            select(Pedido)
            .where(Pedido.id == id)
            .options(selectinload(Pedido.detalles))
        )

        return self.session.exec(statement).first()

    def actualizar(self, pedido: Pedido) -> Pedido:
        self.session.add(pedido)
        self.session.flush()
        return pedido


    def obtener_por_id_bloqueado(
        self,
        id: int
    ) -> Pedido | None:
        statement = (
            select(Pedido)
            .where(Pedido.id == id)
            .options(selectinload(Pedido.detalles))
            .with_for_update(of=Pedido)
        )

        return self.session.exec(statement).first()

    
    def buscar_paginados(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Pedido], int]:

        filtros = []

        if usuario_id is not None:
            filtros.append(
                Pedido.usuario_id == usuario_id
            )

        if estado is not None:
            filtros.append(
                Pedido.estado == estado
            )

        total = self.session.exec(
            select(func.count(Pedido.id)).where(*filtros)
        ).one()

        statement = (
            select(Pedido)
            .where(*filtros)
            .options(selectinload(Pedido.detalles))
            .order_by(Pedido.id.desc())
            .offset(skip)
            .limit(limit)
        )

        pedidos = list(
            self.session.exec(statement).all()
        )

        return pedidos, total

    def obtener_resumen(self) -> dict:
        conteos = dict(
            self.session.exec(
                select(
                    Pedido.estado,
                    func.count(Pedido.id),
                ).group_by(Pedido.estado)
            ).all()
        )

        ahora = datetime.now(timezone.utc)
        inicio_hoy = ahora.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )
        inicio_manana = inicio_hoy + timedelta(days=1)

        pedidos_hoy = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.created_at >= inicio_hoy,
                Pedido.created_at < inicio_manana,
            )
        ).one()

        ingresos = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0))
            .where(Pedido.estado == "ENTREGADO")
        ).one()

        return {
            "pendientes": conteos.get("PENDIENTE", 0),
            "en_preparacion": conteos.get(
                "EN_PREPARACION", 0
            ),
            "entregados": conteos.get("ENTREGADO", 0),
            "cancelados": conteos.get("CANCELADO", 0),
            "pedidos_hoy": pedidos_hoy,
            "ingresos_entregados": float(ingresos),
        }

class DetallePedidoRepository(BaseRepository[DetallePedido]):

    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)

    def crear(
        self,
        detalle: DetallePedido
    ) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        return detalle

    def listar_por_pedido(
        self,
        pedido_id: int
    ) -> list[DetallePedido]:
        statement = select(DetallePedido).where(
            DetallePedido.pedido_id == pedido_id
        )

        return list(self.session.exec(statement).all())
