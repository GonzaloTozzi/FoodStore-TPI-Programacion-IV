# Food Store — Trabajo Práctico Integrador

**Tecnicatura Universitaria en Programación — UTN**  
**Materia:** Programación IV  
**Alumno:** Gonzalo Tozzi

## Descripción

Food Store es una aplicación web de pedidos de comida desarrollada con un **backend FastAPI** y un **frontend React + TypeScript**. Los clientes pueden explorar el catálogo, agregar productos al carrito, registrarse, iniciar sesión y confirmar pedidos. Los administradores cuentan con pantallas para gestionar categorías, productos, stock, pedidos y usuarios, además de consultar un resumen de la actividad.

El frontend consume una API REST bajo `/api/v1`. La información se persiste en **PostgreSQL**. La autenticación utiliza JWT almacenado en una **cookie HttpOnly**, y los permisos se validan en el backend según el rol del usuario.

## Tecnologías utilizadas

| Backend | Frontend |
| --- | --- |
| Python 3.11–3.13 | React 19 + TypeScript |
| FastAPI | Vite 8 |
| SQLModel + Pydantic | Tailwind CSS 4 |
| PostgreSQL + psycopg2 | Axios |
| Pydantic Settings | TanStack Query 5 |
| JWT y bcrypt | TanStack Form 1 |
| Repository + Unit of Work | TanStack Table 8 |
| | React Router 7 + Zustand 5 |

## Funcionalidades principales

**Cliente:**

- Registro, inicio y cierre de sesión.
- Consulta del catálogo con búsqueda, filtrado por categoría y paginación.
- Carrito de compras persistido en el navegador.
- Confirmación de pedidos con dirección, forma de pago y notas opcionales.
- Consulta del historial y detalle de pedidos, y cancelación cuando su estado lo permite.

**Administrador:**

- Alta, edición y baja lógica de categorías y productos.
- Modificación del stock y disponibilidad de productos.
- Consulta de pedidos y actualización de sus estados.
- Listado, activación y desactivación de usuarios.
- Panel de resumen con indicadores de pedidos e ingresos de pedidos entregados.

**Reglas de negocio:** los pedidos descuentan stock al crearse; si se cancelan, se restituye. Las líneas conservan el nombre y precio del producto al momento de la compra. Los estados contemplados son `PENDIENTE`, `EN_PREPARACION`, `ENTREGADO` y `CANCELADO`. La forma de pago es `EFECTIVO` o `TRANSFERENCIA` (sin pasarela de pago).

## Estructura del proyecto

```text
FoodStore/
├── backend/
│   ├── app/
│   │   ├── categoria/
│   │   ├── producto/
│   │   ├── pedidos/
│   │   ├── usuarios/
│   │   ├── core/
│   │   ├── db/
│   │   └── main.py
│   ├── .env.example
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── shared/
│   │   ├── routes/
│   │   └── store/
│   ├── .env.example
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── ...
└── README.md
```

En el backend se separan **Router → Service → Unit of Work → Repository**. El Unit of Work administra las transacciones y los repositorios acceden a los datos con SQLModel. En el frontend, los componentes están organizados por funcionalidades (*features*); **TanStack Query** administra los datos del servidor y **Zustand** administra el estado del cliente.

## Requisitos previos

- **Python 3.11, 3.12 o 3.13**.
- **PostgreSQL 15 o superior**, instalado y en ejecución.
- **Node.js 20.19 o superior** y **pnpm 9 o superior**.
- Una terminal, por ejemplo PowerShell en Windows.

> Los comandos siguientes se ejecutan desde la raíz del proyecto, salvo que se indique otro directorio. Se recomienda abrir **dos terminales**, una para el backend y otra para el frontend.

## 1. Configurar PostgreSQL

Crear una base de datos llamada `tpi_foodstore`. Se puede hacer desde pgAdmin o, si `psql` está disponible, con:

```powershell
psql -U postgres -h localhost -c "CREATE DATABASE tpi_foodstore;"
```

Si la base ya existe, no es necesario volver a crearla.

## 2. Instalar y ejecutar el backend

Desde la raíz del proyecto, ingresar a `backend`:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

En Linux/macOS, el comando para activar el entorno virtual es `source .venv/bin/activate`.

Crear el archivo local de configuración a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Editar `backend/.env` y establecer los valores correspondientes a la instalación local:

```dotenv
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/tpi_foodstore
SECRET_KEY=REEMPLAZAR_POR_UNA_CLAVE_ALEATORIA_SEGURA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@foodstore.com
ADMIN_PASSWORD=Admin1234!
```

Reemplazar `TU_PASSWORD` por la contraseña de PostgreSQL. Para generar una clave JWT, se puede utilizar:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Copiar el resultado en `SECRET_KEY`. **No publicar ni incluir `backend/.env` en la entrega**.

Cargar los datos iniciales:

```powershell
python -m app.db.seed
```

El seed es **idempotente**: comprueba si los registros ya existen antes de crearlos. Crea el usuario administrador, tres categorías y ocho productos de ejemplo. Si el administrador ya existía, no cambia su contraseña.

Iniciar la API:

```powershell
uvicorn app.main:app --reload
```

La API estará disponible en:

- **API:** http://localhost:8000
- **Documentación Swagger:** http://localhost:8000/docs
- **Documentación ReDoc:** http://localhost:8000/redoc
- **Prefijo de endpoints:** `http://localhost:8000/api/v1`

> El backend debe ejecutarse con la terminal ubicada en `backend/`, para que encuentre el archivo `.env` y los módulos de `app`.

## 3. Instalar y ejecutar el frontend

En **otra terminal**, desde la raíz del proyecto:

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env
```

Verificar que `frontend/.env` contenga:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

Para comprobar los tipos y generar la compilación de producción:

```powershell
pnpm build
```

Para iniciar el servidor de desarrollo:

```powershell
pnpm dev
```

Abrir **http://localhost:5173** en el navegador. El backend debe permanecer ejecutándose en `http://localhost:8000`.

> Para instalar pnpm si aún no está disponible, se puede utilizar `npm install -g pnpm@9`.

## Credenciales de prueba

El seed configura el siguiente administrador **si no existe previamente**:

| Campo | Valor |
| --- | --- |
| Usuario | `admin` |
| Correo | `admin@foodstore.com` |
| Contraseña | `Admin1234!` |
| Rol | `admin` |

Para utilizar el rol `user`, registrarse desde **http://localhost:5173/register**. La contraseña de administrador se utiliza solo para las pruebas del trabajo práctico.

## Pantallas del frontend

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Catálogo de productos |
| `/login` y `/register` | Público | Inicio de sesión y registro |
| `/carrito` | Público | Carrito de compras |
| `/checkout` | Sesión iniciada | Confirmación del pedido |
| `/mis-pedidos` | Sesión iniciada | Historial y cancelación |
| `/admin/resumen` | Admin | Indicadores del negocio |
| `/admin/categorias` | Admin | Gestión de categorías |
| `/admin/productos` | Admin | Gestión de productos y stock |
| `/admin/pedidos` | Admin | Gestión de pedidos |
| `/admin/usuarios` | Admin | Gestión de usuarios |

## API REST

La especificación interactiva completa está disponible en **Swagger (`/docs`)**. Entre los endpoints principales se encuentran:

- **Autenticación:** `POST /api/v1/auth/register`, `POST /api/v1/auth/token`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
- **Categorías:** `GET`, `POST`, `PUT` y `DELETE` bajo `/api/v1/categorias`.
- **Productos:** listado y detalle, creación, edición y baja lógica bajo `/api/v1/productos`, más `PATCH /api/v1/productos/{id}/stock`.
- **Pedidos:** `GET` y `POST /api/v1/pedidos`, `GET /api/v1/pedidos/resumen`, detalle y acciones `PATCH /api/v1/pedidos/{id}/estado` y `PATCH /api/v1/pedidos/{id}/cancelar`.
- **Usuarios (admin):** `GET /api/v1/admin/usuarios`, `POST /api/v1/admin/usuarios/{id}/activar` y `POST /api/v1/admin/usuarios/{id}/desactivar`.

Las operaciones protegidas requieren la cookie de sesión y, cuando corresponde, el rol `admin`. Axios está configurado con `withCredentials: true`; el token **no se guarda en localStorage**.

## Solución de problemas habituales

- **Error de conexión a PostgreSQL:** comprobar que el servicio esté iniciado, que `tpi_foodstore` exista y que usuario y contraseña de `DATABASE_URL` sean correctos.
- **El frontend no puede consultar la API:** comprobar que FastAPI esté iniciado, que `VITE_API_URL` apunte a `http://localhost:8000/api/v1` y que `FRONTEND_ORIGIN` coincida con la dirección real del frontend.
- **Error 401:** iniciar sesión nuevamente; la cookie pudo haber expirado.
- **El seed indica que el administrador ya existe:** es el comportamiento esperado; no crea duplicados ni reemplaza automáticamente su contraseña.

## Repositorio y video de demostración

- **Repositorio público de GitHub:** `PENDIENTE: agregar URL del repositorio`.
- **Video de demostración:** [Food Store — TPI Programación IV (YouTube)](https://youtu.be/yabguAJMScA).

**Antes de entregar:** reemplazar el texto pendiente por la URL real del repositorio público y verificar en una ventana de incógnito que tanto el repositorio como el video sean accesibles sin iniciar sesión.

---

*Trabajo Práctico Integrador de Programación IV — UTN.*
