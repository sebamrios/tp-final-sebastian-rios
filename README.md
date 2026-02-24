# Patitas Felices - Sistema de Gestión Veterinaria

## 📝 Descripción General
"Patitas Felices" es una aplicación de backend robusta diseñada para gestionar las operaciones diarias de una clínica veterinaria. El sistema permite administrar usuarios con diferentes roles (administradores, veterinarios, secretarias y clientes), gestionar el registro de mascotas y mantener un historial clínico detallado de cada una.

## 🚀 Tecnologías Utilizadas
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express](https://expressjs.com/)
- **Base de Datos:** [MySQL](https://www.mysql.com/)
- **Contenerización:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Autenticación:** [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Envío de Correos:** [MailerSend](https://www.mailersend.com/)
- **Motor de Plantillas:** [Handlebars](https://handlebarsjs.com/) (para vistas administrativas)

## 🛠️ Instrucciones de Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
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
docker-compose up -d
```
    *   Iniciar en modo desarrollo:
```bash
npm run dev
```

## 🔌 Endpoints Principales

### Autenticación y Usuarios
- `POST /api/users/login`: Inicia sesión y devuelve un token JWT.
- `GET /api/users/all`: Lista todos los usuarios (Requiere rol Admin/Vet/Secretaria).
- `POST /api/users/`: Registra un nuevo usuario.

### Mascotas
- `GET /api/mascotas/all`: Obtiene todas las mascotas registradas.
- `GET /api/mascotas/cliente/:usuarioId`: Obtiene las mascotas de un cliente específico.
- `POST /api/mascotas/`: Registra una nueva mascota.

### Historial Clínico
- `GET /api/historial/:mascotaId`: Obtiene el historial clínico de una mascota.
- `POST /api/historial/`: Agrega una nueva entrada al historial clínico.

## 🧪 Guía CRUD Completa (Rol Admin)

Usa estos comandos para verificar el funcionamiento total del sistema del lado del servidor.

> [!IMPORTANT]
> Reemplaza `<TU_TOKEN_AQUI>` con el token obtenido en el login. 
> Reemplaza `<ID>` con el ID real del registro que desees consultar, actualizar o eliminar.

### 👤 Gestión de Usuarios
| Acción | Método | Endpoint |
| :--- | :--- | :--- |
| **Login** | `POST` | `/api/users/login` |
| **Listar Todos** | `GET` | `/api/users/all` |
| **Ver Uno** | `GET` | `/api/users/:id` |
| **Crear** | `POST` | `/api/users/` |
| **Actualizar** | `PUT` | `/api/users/:id` |
| **Eliminar** | `DELETE` | `/api/users/:id` |

**Ejemplos:**
```bash
# Listar todos los usuarios
curl -X GET http://localhost:3000/api/users/all -H "Authorization: Bearer <TOKEN>"

# Actualizar nombre y rol de un usuario
curl -X PUT http://localhost:3000/api/users/1 \
     -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
     -d '{"nombre": "Admin Actualizado", "role": "admin"}'

# Eliminar un usuario
curl -X DELETE http://localhost:3000/api/users/5 -H "Authorization: Bearer <TOKEN>"
```

### 🐾 Gestión de Mascotas
| Acción | Método | Endpoint |
| :--- | :--- | :--- |
| **Listar Todas** | `GET` | `/api/mascotas/all` |
| **Listar por Dueño**| `GET` | `/api/mascotas/cliente/:usuarioId` |
| **Crear** | `POST` | `/api/mascotas/` |
| **Actualizar** | `PUT` | `/api/mascotas/:id` |
| **Eliminar** | `DELETE` | `/api/mascotas/:id` |

**Ejemplos:**
```bash
# Registrar mascota vinculada a usuario con ID 1
curl -X POST http://localhost:3000/api/mascotas/ \
     -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
     -d '{"nombre": "Luna", "especie": "Gato", "raza": "Siamés", "edad": 2, "id_usuario": 1}'

# Actualizar datos de una mascota
curl -X PUT http://localhost:3000/api/mascotas/1 \
     -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
     -d '{"edad": 3, "raza": "Siamés Mezcla"}'
```

### 📋 Gestión de Historial Clínico
| Acción | Método | Endpoint |
| :--- | :--- | :--- |
| **Ver por Mascota** | `GET` | `/api/historial/:mascotaId` |
| **Crear Entrada** | `POST` | `/api/historial/` |
| **Actualizar** | `PUT` | `/api/historial/:id` |
| **Eliminar** | `DELETE` | `/api/historial/:id` |

**Ejemplos:**
```bash
# Crear nueva entrada (mascotaId 1)
curl -X POST http://localhost:3000/api/historial/ \
     -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
     -d '{"mascotaId": 1, "observaciones": "Chequeo anual", "diagnostico": "Sano", "tratamiento": "Ninguno"}'

# Actualizar tratamiento de una entrada
curl -X PUT http://localhost:3000/api/historial/1 \
     -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
     -d '{"tratamiento": "Vitaminas C cada 12hs"}'
```

---

## 🖥️ Opción de Frontend
El proyecto utiliza una combinación de:
- **Archivos Estáticos:** La carpeta `/public` contiene archivos HTML, CSS y JS que interactúan con la API. Estos pueden ser servidos directamente por Express.
- **Vistas Handlebars:** (Opcional/En desarrollo) Disponibles bajo la ruta `/handlebars` para renderizado del lado del servidor.

---
© 2024 Patitas Felices - Proyecto de Aprendizaje.