#  Food Store — Trabajo Práctico Integrador

**Universidad Tecnológica Nacional (UTN)**  
**Tecnicatura Universitaria en Programación**  
**Materia:** Programación IV  
**Alumno:** Gonzalo Tozzi

##  Descripción del proyecto

Food Store es una aplicación web Full Stack para la gestión de pedidos de un negocio de comidas.

El sistema permite a los clientes registrarse, iniciar sesión, consultar el catálogo de productos, utilizar un carrito de compras y realizar pedidos.

También cuenta con un panel de administración para gestionar categorías, productos, stock, usuarios y pedidos, además de consultar indicadores generales del negocio.

La aplicación utiliza un backend desarrollado con **FastAPI**, un frontend desarrollado con **React y TypeScript** y una base de datos **PostgreSQL**.

##  Enlaces del proyecto

- **Repositorio GitHub:** https://github.com/GonzaloTozzi/FoodStore-TPI-Programacion-IV
- **Video de demostración:** https://youtu.be/yabguAJMScA

##  Tecnologías utilizadas

### Backend

- Python 3.11 o superior (hasta 3.13).
- FastAPI.
- SQLModel.
- PostgreSQL.
- Pydantic y Pydantic Settings.
- JWT para autenticación.
- bcrypt para contraseñas.
- Arquitectura Repository, Service y Unit of Work.

### Frontend

- React 19.
- TypeScript.
- Vite.
- Tailwind CSS.
- Axios.
- TanStack Query.
- TanStack Form.
- TanStack Table.
- React Router.
- Zustand.

##  Estructura del proyecto

```text
TPI_Tozzi_Gonzalo/
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
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── routes/
│   │   ├── shared/
│   │   └── store/
│   ├── .env.example
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── ...
│
├── .gitignore
└── README.md
```

##  Arquitectura del backend

El backend está organizado en capas para separar responsabilidades.

- **Router:** recibe las peticiones HTTP y devuelve las respuestas.
- **Service:** implementa las reglas de negocio y validaciones.
- **Repository:** realiza las operaciones sobre la base de datos utilizando SQLModel.
- **Unit of Work:** administra las sesiones y transacciones, realizando commit o rollback según corresponda.

Esta organización permite mantener la lógica de negocio separada del acceso a datos y de los endpoints.

El frontend está organizado por funcionalidades, utilizando componentes reutilizables, servicios de API y hooks personalizados.

##  Funcionalidades implementadas

### Cliente

- Registro e inicio de sesión.
- Consulta del catálogo de productos.
- Búsqueda por nombre.
- Filtrado por categoría.
- Paginación de productos.
- Carrito de compras con persistencia local.
- Confirmación de pedidos.
- Selección de forma de pago.
- Ingreso de dirección de entrega.
- Historial y detalle de compras.
- Cancelación de pedidos pendientes.

### Administrador

- Panel de resumen con indicadores.
- Creación, edición y baja lógica de categorías.
- Creación, edición y baja lógica de productos.
- Gestión de stock y disponibilidad.
- Consulta y administración de pedidos.
- Actualización del estado de los pedidos.
- Consulta, activación y desactivación de usuarios.

### Reglas de negocio

Al realizar un pedido, el backend valida que los productos existan, estén disponibles y tengan stock suficiente.

Si la compra se confirma correctamente, se registra el pedido y se descuentan las unidades compradas del stock.

Si el pedido se cancela, el sistema restituye automáticamente las unidades descontadas, evitando realizar la devolución más de una vez.

Los pedidos utilizan los siguientes estados:

- `PENDIENTE`
- `EN_PREPARACION`
- `ENTREGADO`
- `CANCELADO`

Además, cada detalle de pedido conserva el nombre y el precio del producto al momento de la compra.

##  Seguridad

El sistema implementa autenticación mediante JWT almacenado en una cookie HttpOnly.

Las contraseñas de los usuarios se almacenan utilizando bcrypt.

Se manejan dos roles:

- **user:** permite consultar productos, realizar compras y administrar los pedidos propios.
- **admin:** permite acceder a las funcionalidades administrativas.

El backend verifica los permisos de cada usuario antes de ejecutar operaciones protegidas.

El frontend utiliza rutas protegidas y Axios configurado con `withCredentials` para enviar las cookies de sesión.

El JWT no se almacena en `localStorage`.

##  Requisitos previos

Para ejecutar el proyecto es necesario tener instalados:

- Python 3.11, 3.12 o 3.13.
- PostgreSQL.
- Node.js 20.19 o superior.
- pnpm 9 o superior.
- Git, para clonar el repositorio.

##  Instalación y ejecución

### 1. Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/GonzaloTozzi/FoodStore-TPI-Programacion-IV.git
cd FoodStore-TPI-Programacion-IV
```

### 2. Crear la base de datos

Desde PostgreSQL o pgAdmin, crear una base de datos llamada:

```sql
CREATE DATABASE tpi_foodstore;
```

### 3. Configurar el backend

Ingresar a la carpeta del backend:

```powershell
cd backend
```

Crear y activar un entorno virtual en Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instalar las dependencias:

```powershell
pip install -r requirements.txt
```

Crear el archivo de variables de entorno:

```powershell
Copy-Item .env.example .env
```

Editar el archivo `backend/.env` y configurar:

```dotenv
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/tpi_foodstore

SECRET_KEY=REEMPLAZAR_POR_UNA_CLAVE_SEGURA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

FRONTEND_ORIGIN=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@foodstore.com
ADMIN_PASSWORD=Admin1234!
```

Reemplazar `TU_PASSWORD` con la contraseña local de PostgreSQL.

Para generar una clave JWT segura, ejecutar:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Copiar la clave generada en `SECRET_KEY`.

**Importante:** los archivos `.env` contienen datos sensibles y no deben subirse al repositorio.

### 4. Inicializar los datos

Ejecutar:

```powershell
python -m app.db.seed
```

El seed carga los datos iniciales del proyecto:

- Un usuario administrador.
- Tres categorías.
- Ocho productos de ejemplo.

El seed es idempotente, por lo que puede ejecutarse varias veces sin duplicar registros existentes.

### 5. Iniciar el backend

Ejecutar:

```powershell
uvicorn app.main:app --reload
```

La API estará disponible en:

**http://localhost:8000**

La documentación interactiva de FastAPI se encuentra en:

**http://localhost:8000/docs**

### 6. Configurar el frontend

Abrir una segunda terminal en la raíz del proyecto e ingresar a la carpeta:

```powershell
cd frontend
```

Instalar las dependencias:

```powershell
pnpm install
```

Crear el archivo de configuración:

```powershell
Copy-Item .env.example .env
```

Verificar que `frontend/.env` contenga:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

### 7. Iniciar el frontend

Ejecutar:

```powershell
pnpm dev
```

Abrir en el navegador:

**http://localhost:5173**

El backend debe permanecer ejecutándose mientras se utiliza el frontend.

##  Credenciales de prueba

El administrador se crea automáticamente al ejecutar el seed por primera vez.

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Correo electrónico | `admin@foodstore.com` |
| Contraseña | `Admin1234!` |
| Rol | `admin` |

Para utilizar el sistema como cliente, se puede registrar una cuenta desde la pantalla de registro.

Estas credenciales están destinadas únicamente a la demostración académica.

##  API REST

Los endpoints principales utilizan el prefijo `/api/v1`.

### Autenticación

| Método | Endpoint |
|---|---|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/token` |
| POST | `/api/v1/auth/logout` |
| GET | `/api/v1/auth/me` |

### Categorías

| Método | Endpoint |
|---|---|
| GET | `/api/v1/categorias` |
| POST | `/api/v1/categorias` |
| PUT | `/api/v1/categorias/{id}` |
| DELETE | `/api/v1/categorias/{id}` |

### Productos

| Método | Endpoint |
|---|---|
| GET | `/api/v1/productos` |
| GET | `/api/v1/productos/{id}` |
| POST | `/api/v1/productos` |
| PUT | `/api/v1/productos/{id}` |
| DELETE | `/api/v1/productos/{id}` |
| PATCH | `/api/v1/productos/{id}/stock` |

### Pedidos

| Método | Endpoint |
|---|---|
| GET | `/api/v1/pedidos` |
| POST | `/api/v1/pedidos` |
| GET | `/api/v1/pedidos/resumen` |
| GET | `/api/v1/pedidos/{id}` |
| PATCH | `/api/v1/pedidos/{id}/estado` |
| PATCH | `/api/v1/pedidos/{id}/cancelar` |

### Administración de usuarios

| Método | Endpoint |
|---|---|
| GET | `/api/v1/admin/usuarios` |
| POST | `/api/v1/admin/usuarios/{id}/activar` |
| POST | `/api/v1/admin/usuarios/{id}/desactivar` |

La documentación completa, con los esquemas de entrada y salida, puede consultarse en Swagger.

##  Pruebas y demostración

Durante el desarrollo se realizaron pruebas de los endpoints utilizando Swagger y archivos HTTP, verificando las principales operaciones y respuestas del backend.

También se realizaron pruebas de integración desde el frontend, incluyendo autenticación, consulta de productos, creación de pedidos, actualización de estados y cancelación con restitución de stock.

El video de demostración presenta el funcionamiento de Food Store desde los roles de cliente y administrador.

**Video:** https://youtu.be/yabguAJMScA

##  Conclusión

Food Store integra los conocimientos desarrollados durante Programación IV, aplicando desarrollo Full Stack, APIs REST, persistencia relacional, autenticación, autorización, manejo del estado y arquitectura por capas.

El proyecto permite cubrir el proceso completo de compra y administración de un negocio de comidas, manteniendo la consistencia de la información mediante transacciones y validaciones implementadas en el backend.

---

**Trabajo Práctico Integrador — Programación IV**  
**UTN — Tecnicatura Universitaria en Programación**  
**Gonzalo Tozzi — 2026**
