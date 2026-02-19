# Backend Node TS - Veterinaria Patitas Felices

Un pequeño backend desarrollado con Node.js y TypeScript para la gestión de una veterinaria. Incluye autenticación con JWT, manejo de base de datos MySQL y vistas simples con Handlebars.

## 🚀 Tecnologías

*   **Node.js** con **TypeScript**
*   **Express** (Framework Web)
*   **MySQL** (Base de datos) con `mysql2`
*   **JWT** (Autenticación)
*   **Bcryptjs** (Hashing de contraseñas)
*   **Handlebars** (Motor de plantillas para vistas)
*   **Docker** & **Docker Compose** (Contenedorización)

## 📋 Prerrequisitos

*   **Docker** y **Docker Compose** instalados.
*   (Opcional) **Node.js** y **NPM** si deseas ejecutarlo localmente sin Docker.

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repo>
    cd backend-node-ts
    ```

2.  **Variables de Entorno:**
    El archivo `.env` ya viene configurado por defecto para trabajar con Docker. (Verificar archivo `.env`).

3.  **Iniciar con Docker (Recomendado):**
    Levanta la aplicación, la base de datos MySQL y PhpMyAdmin.

    ```bash
    docker-compose up --build
    ```

    *   **API:** `http://localhost:3000`
    *   **PhpMyAdmin:** `http://localhost:8081` (Servidor: `mysql`, Usuario: `root`, Password: `root123`)

4.  **Si vas a desarrollar localmente (Sin Docker para la App):**
    
    *   Asegúrate de tener la base de datos MySQL corriendo (puedes usar `docker-compose up mysql` solamente).
    *   Instala dependencias:
        ```bash
        npm install
        ```
    *   Iniciar en modo desarrollo:
        ```bash
        npm run dev
        ```

## 🔌 Endpoints de la API

### Autenticación y Usuarios (`/api/users`)

| Método    | Endpoint             | Descripción                       | Requiere Auth |
| :---      | :---                 | :---                              | :---          |
| `POST`   | `/api/users/login`   | Iniciar sesión (Retorna Token JWT) | No            |
| `POST`   | `/api/users`         | Registrar nuevo usuario            | No            |
| `GET`    | `/api/users`         | Listar todos los usuarios          | No            |
| `GET`    | `/api/users/clientes`| Listar solo usuarios clientes      | No            |
| `GET`    | `/api/users/:id`     | Obtener usuario por ID             | No            |
| `PUT`    | `/api/users/:id`     | Actualizar usuario                 | si            |
| `DELETE` | `/api/users/:id`     | Eliminar usuario                   | si            |

### Mascotas (`/api/mascotas`)

| Método   | Endpoint                           | Descripción                  | Requiere Auth |
| :---     | :---                               | :---                         | :---          |
| `POST`   | `/api/mascotas`                    | Registrar mascota            | No            |
| `GET`    | `/api/mascotas`                    | Listar todas las mascotas    | No            |
| `GET`    | `/api/mascotas/cliente/:usuarioId` | Listar mascotas de un cliente| No            |
| `PUT`    | `/api/mascotas/:id`                | Actualizar mascota           | **Sí** (Token)|
| `DELETE` | `/api/mascotas/:id`                | Eliminar mascota             | **Sí** (Token)|

### Vistas (`/handlebars`)

| Método | Endpoint            | Descripción          |
| :---   | :---                | :---                 |
| `GET`  | `/handlebars`       | Vista Home de prueba |
| `GET`  | `/handlebars/about` | Vista About (ToDo)   |

--------------------------------------------------------------------------------------
CURL 

 curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sebastian Rios",
    "email": "sebastian_test@medrano.com",
    "password": "password123",
    "role": "admin"
  }'
{"message":"Usuario creado correctamente","userId":5}

--------------------------------------------------------------------------------------
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Perez",
    "email": "juan_cliente@medrano.com",
    "password": "cliente123",
    "role": "cliente"
  }'
{"message":"Usuario creado correctamente","userId":6}

--------------------------------------------------------------------------------------
$ curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan_cliente@medrano.com", 
    "password": "cliente123"
  }'
{"message":"Login exitoso","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqdWFuX2NsaWVudGVAbWVkcmFuby5jb20iLCJyb2xlIjoiY2xpZW50ZSIsImlhdCI6MTc3MDIzMTEwOSwiZXhwIjoxNzcwMjQ1NTA5fQ.etJnUVuEacD-aUrnl5a6yLld5LHEsro4E-hH9OzqhB8","user":{"id":6,"nombre":"juan_cliente","email":"juan_cliente@medrano.com","role":"cliente"}}

--------------------------------------------------------------------------------------
$ curl -X POST http://localhost:3000/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Felix",
    "especie": "Gato",
    "raza": "Callejero",
    "edad": 3,
    "id_usuario": 5
  }'
{"message":"Mascota creada correctamente","id":5}

--------------------------------------------------------------------------------------
$ curl -X DELETE http://localhost:3000/api/users/5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqdWFuX2NsaWVudGVAbWVkcmFuby5jb20iLCJyb2xlIjoiY2xpZW50ZSIsImlhdCI6MTc3MDIzMTEwOSwiZXhwIjoxNzcwMjQ1NTA5fQ.etJnUVuEacD-aUrnl5a6yLld5LHEsro4E-hH9OzqhB8"
{"message":"Usuario eliminado correctamente"}

--------------------------------------------------------------------------------------
$ curl -X GET http://localhost:3000/api/users
[{"id":1,"nombre":"juan","email":"juan@example.com","role":"user","created_at":"2026-02-03T01:29:33.000Z"},{"id":2,"nombre":"maria","email":"maria@example.com","role":"user","created_at":"2026-02-03T02:13:04.000Z"},{"id":3,"nombre":"roberto","email":"roberto@mail.com","role":"cliente","created_at":"2026-02-03T02:16:51.000Z"},{"id":4,"nombre":"utn_test","email":"utn_test@medrano.com","role":"admin","created_at":"2026-02-04T01:50:28.000Z"},{"id":6,"nombre":"juan_cliente","email":"juan_cliente@medrano.com","role":"cliente","created_at":"2026-02-04T18:51:10.000Z"}]

--------------------------------------------------------------------------------------
$ curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sebastian Rios",
    "email": "sebastian_test@medrano.com",
    "password": "password123",
    "role": "admin"
  }'
{"message":"Usuario creado correctamente","userId":7}

---------------------------------------------------------------------------------------
$ curl -X GET http://localhost:3000/api/users
[{"id":1,"nombre":"juan","email":"juan@example.com","role":"user","created_at":"2026-02-03T01:29:33.000Z"},{"id":2,"nombre":"maria","email":"maria@example.com","role":"user","created_at":"2026-02-03T02:13:04.000Z"},{"id":3,"nombre":"roberto","email":"roberto@mail.com","role":"cliente","created_at":"2026-02-03T02:16:51.000Z"},{"id":4,"nombre":"utn_test","email":"utn_test@medrano.com","role":"admin","created_at":"2026-02-04T01:50:28.000Z"},{"id":6,"nombre":"juan_cliente","email":"juan_cliente@medrano.com","role":"cliente","created_at":"2026-02-04T18:51:10.000Z"},{"id":7,"nombre":"sebastian_test","email":"sebastian_test@medrano.com","role":"admin","created_at":"2026-02-04T18:59:41.000Z"}]

--------------------------------------------------------------------------------------
$ curl -X DELETE http://localhost:3000/api/users/7   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqdWFu
X2NsaWVudGVAbWVkcmFuby5jb20iLCJyb2xlIjoiY2xpZW50ZSIsImlhdCI6MTc3MDIzMTEwOSwiZXhwIjoxNzcwMjQ1NTA5fQ.etJnUVuEacD-aUrnl5a6yLld5LHEsro4E-hH9OzqhB8" 
{"message":"Usuario eliminado correctamente"}

--------------------------------------------------------------------------------------
$ curl -X GET http://localhost:3000/api/users
[{"id":1,"nombre":"juan","email":"juan@example.com","role":"user","created_at":"2026-02-03T01:29:33.000Z"},{"id":2,"nombre":"maria","email":"maria@example.com","role":"user","created_at":"2026-02-03T02:13:04.000Z"},{"id":3,"nombre":"roberto","email":"roberto@mail.com","role":"cliente","created_at":"2026-02-03T02:16:51.000Z"},{"id":4,"nombre":"utn_test","email":"utn_test@medrano.com","role":"admin","created_at":"2026-02-04T01:50:28.000Z"},{"id":6,"nombre":"juan_cliente","email":"juan_cliente@medrano.com","role":"cliente","created_at":"2026-02-04T18:51:10.000Z"}]

------------------------------------------------------------------------------------------
$ curl -X POST http://localhost:3000/api/mascotas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqdWFuX2NsaWVudGVAbWVkcmFuby5jb20iLCJyb2xlIjoiY2xpZW50ZSIsImlhdCI6MTc3MDIzMTEwOSwiZXhwIjoxNzcwMjQ1NTA5fQ.etJnUVuEacD-aUrnl5a6yLld5LHEsro4E-hH9OzqhB8" \
  -d '{
    "nombre": "Felix",
    "especie": "Gato",
    "raza": "Callejero",
    "edad": 3,
    "id_usuario": 6
  }'
{"message":"Mascota creada correctamente","id":6}

------------------------------------------------------------------------------------------------
$ curl -X PUT http://localhost:3000/api/mascotas/6   -H "Content-Type: application/json"   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqdWFuX2NsaWVudGVAbWVkcmFuby5jb20iLCJyb2xlIjoiY2xpZW50ZSIsImlhdCI6MTc3MDIzMTEwOSwiZXhwIjoxNzcwMjQ1NTA5fQ.etJnUVuEacD-aUrnl5a6yLld5LHEsro4E-hH9OzqhB8"   -d '{
    "nombre": "Fenix",
    "especie": "Gato",
    "raza": "Callejero",
    "edad": 3,
    "id_usuario": 6
  }'