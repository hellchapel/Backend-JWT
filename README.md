# Backend – API REST con autenticación JWT

API REST desarrollada en **Node.js + Express** con **MongoDB (Mongoose)**. Permite registrar usuarios, iniciar sesión obteniendo un **token JWT** y administrar un **CRUD de tareas protegido con Bearer Token**, donde cada usuario solo puede ver, modificar y eliminar sus propias tareas.

Proyecto de la materia **Ingeniería de Software** – Universidad Anáhuac Mayab.

**Autores:** Vanessa Becerril y Erwin Torres

## Tecnologías

- Node.js y Express 5
- MongoDB con Mongoose
- jsonwebtoken (JWT) para la autenticación
- bcrypt para el hash de contraseñas
- dotenv para las variables de entorno

## Estructura del proyecto

```
backend/
├── config/db.js                  # Conexión a MongoDB
├── Controllers/
│   ├── usersControllers.js       # crearUser, loginUser, datosUser
│   └── tareasController.js       # getTareas, createTareas, updateTareas, deleteTareas
├── middleware/
│   ├── authMiddleware.js         # protect: valida el Bearer Token
│   └── errorMiddleware.js        # Manejo de errores en JSON
├── models/
│   ├── usersModel.js
│   └── tareasModel.js
├── routes/
│   ├── usersRoutes.js            # /api/users
│   └── tareasRoutes.js           # /api/tareas
└── server.js
```

## Instalación

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone <url-del-repositorio>
   cd Backend
   npm install
   ```

2. Copia el archivo `.env.example` como `.env` y llena los valores:

   ```
   PORT=5000
   MONGO_DB=<cadena de conexión a MongoDB>
   JWT_SECRET=<clave secreta para firmar los tokens>
   NODE_ENV=development
   ```

   El archivo `.env` **no se sube** al repositorio (está en `.gitignore`).

## Ejecución

```bash
npm run server   # modo desarrollo (nodemon, se reinicia con cada cambio)
npm start        # modo normal
```

El servidor queda disponible en `http://localhost:5000`.

## Endpoints

| Método | Ruta | Descripción | ¿Requiere token? |
|--------|------|-------------|------------------|
| POST | `/api/users` | Crear usuario. Body: `nombre`, `email`, `password` | No |
| POST | `/api/users/login` | Iniciar sesión y devolver el JWT. Body: `email`, `password` | No |
| GET | `/api/users/datos` | Datos del usuario dueño del token | Sí |
| GET | `/api/tareas` | Listar solo las tareas del usuario logueado | Sí |
| POST | `/api/tareas` | Crear una tarea para el usuario logueado. Body: `descripcion` | Sí |
| PUT | `/api/tareas/:id` | Modificar una tarea propia. Body: `descripcion` | Sí |
| DELETE | `/api/tareas/:id` | Eliminar una tarea propia | Sí |

Las rutas protegidas necesitan el header:

```
Authorization: Bearer <token>
```

## Seguridad

- Todas las rutas de tareas pasan por el middleware `protect`, que valida el token con `jwt.verify`. Sin token, o con un token inválido o alterado, la respuesta es **401 Unauthorized**.
- El id del usuario se obtiene **del token** (`req.user.id`), nunca del body ni de la URL.
- Cada tarea guarda el id de su dueño (`user`) y las consultas filtran por ese id.
- Si un usuario intenta modificar o eliminar una tarea que no es suya, la API responde **403 Forbidden** y la tarea no cambia.
- Las contraseñas se guardan con hash (bcrypt) y nunca se devuelven en las respuestas.

## Códigos de respuesta

| Código | Cuándo |
|--------|--------|
| 200 | Consulta, login, modificación o eliminación correcta |
| 201 | Usuario o tarea creados |
| 400 | Faltan datos o el correo ya está registrado |
| 401 | Sin token, token inválido o credenciales incorrectas |
| 403 | La tarea pertenece a otro usuario |
| 404 | La tarea no existe |
