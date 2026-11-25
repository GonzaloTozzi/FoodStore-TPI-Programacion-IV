
import os

import bcrypt
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, select

from app.categoria.model import Categoria
from app.core.database import engine
from app.usuarios.models import Usuario

# Importamos los modelos para registrar sus tablas.
from app.pedidos.models import DetallePedido, Pedido  # noqa: F401
from app.producto.model import Producto

load_dotenv()


def cargar_admin(session: Session):
    username = os.getenv("ADMIN_USERNAME", "admin")
    email = os.getenv("ADMIN_EMAIL", "admin@foodstore.com")
    password = os.getenv("ADMIN_PASSWORD")

    if not password or len(password) < 8:
        raise RuntimeError(
            "ADMIN_PASSWORD debe tener al menos 8 caracteres"
        )

    usuario = session.exec(
        select(Usuario).where(Usuario.username == username)
    ).first()

    if usuario is None:
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        usuario = Usuario(
            username=username,
            full_name="Administrador Food Store",
            email=email,
            hashed_password=hashed_password,
            role="admin",
            disabled=False,
        )

        session.add(usuario)
        session.flush()
        print("Administrador creado")
    else:
        print("Administrador ya existente")


def cargar_categorias(session: Session):
    categorias = [
        ("Bebidas", "Bebidas frÃ­as y calientes"),
        ("Alimentos", "Productos alimenticios"),
        ("Snacks", "Snacks y golosinas"),
    ]

    for nombre, descripcion in categorias:
        existente = session.exec(
            select(Categoria).where(Categoria.nombre == nombre)
        ).first()

        if existente is None:
            session.add(
                Categoria(
                    nombre=nombre,
                    descripcion=descripcion,
                    activo=True,
                )
            )

    session.flush()
    print("CategorÃ­as verificadas")


def cargar_productos(session: Session):
    productos = [
        ("Bebidas", "Agua mineral", 1500, 30),
        ("Bebidas", "Gaseosa cola", 2500, 25),
        ("Bebidas", "Jugo de naranja", 2200, 20),
        ("Alimentos", "Arroz", 1800, 40),
        ("Alimentos", "Fideos", 1600, 35),
        ("Alimentos", "Aceite", 3500, 15),
        ("Snacks", "Papas fritas", 2000, 25),
        ("Snacks", "Chocolate", 1800, 30),
    ]

    categorias = {
        categoria.nombre: categoria.id
        for categoria in session.exec(select(Categoria)).all()
    }

    for categoria, nombre, precio, stock in productos:
        existente = session.exec(
            select(Producto).where(Producto.nombre == nombre)
        ).first()

        if existente is None:
            session.add(
                Producto(
                    categoria_id=categorias[categoria],
                    nombre=nombre,
                    descripcion=nombre,
                    precio_base=precio,
                    imagen_url="",
                    stock=stock,
                    disponible=True,
                    activo=True,
                )
            )

    session.flush()
    print("Productos verificados")


def main():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        with session.begin():
            cargar_admin(session)
            cargar_categorias(session)
            cargar_productos(session)

    print("Seed de Food Store ejecutado correctamente")


if __name__ == "__main__":
    main()
