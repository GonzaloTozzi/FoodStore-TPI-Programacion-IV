
from datetime import datetime, timezone

from .models import DetallePedido, Pedido
from .schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .unit_of_work import PedidoUnitOfWork


class PedidoNoEncontrado(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class EstadoPedidoInvalido(Exception):
    pass


class PedidoSinPermiso(Exception):
    pass


class DatosPedidoInvalidos(Exception):
    pass


TRANSICIONES_VALIDAS = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoService:

    def _convertir_a_read(self, pedido: Pedido) -> PedidoRead:
        return PedidoRead.model_validate(pedido)

    def crear(
        self,
        data: PedidoCreate,
        usuario_id: int,
    ) -> PedidoRead:

        with PedidoUnitOfWork() as uow:

            if not data.detalles:
                raise DatosPedidoInvalidos(
                    "El pedido debe contener productos"
                )

            ids = [
                detalle.producto_id
                for detalle in data.detalles
            ]

            if len(ids) != len(set(ids)):
                raise DatosPedidoInvalidos(
                    "No se puede repetir un producto"
                )

            cantidades = {
                detalle.producto_id: detalle.cantidad
                for detalle in data.detalles
            }

            productos = {}
            total = 0.0

            # Bloqueo en orden para reducir deadlocks.
            for producto_id in sorted(ids):
                producto = (
                    uow.productos.obtener_por_id_bloqueado(
                        producto_id
                    )
                )

                if producto is None:
                    raise ProductoNoEncontrado()

                if not producto.activo or not producto.disponible:
                    raise ProductoNoDisponible()

                cantidad = cantidades[producto_id]

                if cantidad < 1:
                    raise DatosPedidoInvalidos(
                        "La cantidad debe ser positiva"
                    )

                if producto.stock < cantidad:
                    raise StockInsuficiente(
                        f"Stock insuficiente para {producto.nombre}"
                    )

                productos[producto_id] = producto

            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0.0,
            )

            uow.pedidos.crear(pedido)

            for detalle_data in data.detalles:
                producto = productos[detalle_data.producto_id]
                cantidad = detalle_data.cantidad

                subtotal = round(
                    producto.precio_base * cantidad, 2
                )

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )

                uow.detalles.crear(detalle)

                producto.stock -= cantidad
                uow.productos.actualizar(producto)

                total += subtotal

            pedido.total = round(total, 2)

            uow.pedidos.actualizar(pedido)

            # Recargar detalles para construir la respuesta.
            pedido = uow.pedidos.obtener_por_id(pedido.id)

            return self._convertir_a_read(pedido)

    def listar(
        self,
        usuario_id: int | None = None,
    ) -> list[PedidoRead]:

        with PedidoUnitOfWork() as uow:

            if usuario_id is None:
                pedidos = uow.pedidos.listar()
            else:
                pedidos = uow.pedidos.listar_por_usuario(
                    usuario_id
                )

            return [
                self._convertir_a_read(pedido)
                for pedido in pedidos
            ]

    
    def buscar_paginados(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> PedidosPaginados:

        with PedidoUnitOfWork() as uow:
            pedidos, total = uow.pedidos.buscar_paginados(
                usuario_id=usuario_id,
                estado=estado,
                skip=skip,
                limit=limit,
            )

            return PedidosPaginados(
                total=total,
                items=[
                    self._convertir_a_read(pedido)
                    for pedido in pedidos
                ],
            )

    def obtener_resumen(self) -> ResumenPedidos:

        with PedidoUnitOfWork() as uow:
            datos = uow.pedidos.obtener_resumen()

            return ResumenPedidos.model_validate(datos)


    def obtener_por_id(
        self,
        pedido_id: int,
        usuario_id: int,
        es_admin: bool = False,
    ) -> PedidoRead:

        with PedidoUnitOfWork() as uow:
            pedido = uow.pedidos.obtener_por_id(
                pedido_id
            )

            if pedido is None:
                raise PedidoNoEncontrado()

            if not es_admin and pedido.usuario_id != usuario_id:
                raise PedidoSinPermiso()

            return self._convertir_a_read(pedido)

    def cambiar_estado(
        self,
        pedido_id: int,
        nuevo_estado: str,
        usuario_id: int,
        es_admin: bool = False,
    ) -> PedidoRead:

        with PedidoUnitOfWork() as uow:

            pedido = uow.pedidos.obtener_por_id_bloqueado(
                pedido_id
            )

            if pedido is None:
                raise PedidoNoEncontrado()

            
            if not es_admin:
                if pedido.usuario_id != usuario_id:
                    raise PedidoSinPermiso()

                if nuevo_estado != "CANCELADO":
                    raise PedidoSinPermiso()

                if pedido.estado != "PENDIENTE":
                    raise EstadoPedidoInvalido()


            permitidos = TRANSICIONES_VALIDAS.get(
                pedido.estado, set()
            )

            if nuevo_estado not in permitidos:
                raise EstadoPedidoInvalido()

            if nuevo_estado == "CANCELADO":

                # Bloquear productos en orden consistente.
                detalles_ordenados = sorted(
                    pedido.detalles,
                    key=lambda d: d.producto_id
                )

                for detalle in detalles_ordenados:

                    producto = (
                        uow.productos.obtener_por_id_bloqueado(
                            detalle.producto_id
                        )
                    )

                    if producto is None:
                        raise ProductoNoEncontrado()

                    producto.stock += detalle.cantidad

                    uow.productos.actualizar(producto)

            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.now(timezone.utc)

            uow.pedidos.actualizar(pedido)

            return self._convertir_a_read(pedido)
