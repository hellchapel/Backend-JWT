# Correcciones al backend

## Errores que impedían arrancar el servidor
- `models/usersModel.js`: `unique: trusted` → `unique: true`.
- `models/tareasModel.js`: se exportaba `tareaSchema` (no existía) → `tareasSchema`.
- `Controllers/usersControllers.js`: faltaba el `require` → `const User = require('../models/usersModel')`.

## Errores que hacían fallar las pruebas
- `middleware/errorMiddleware.js`: `res.StatusCode` → `res.statusCode`. Antes todos los errores salían como 500.
- `middleware/authMiddleware.js`: la condición final era `if (token)` en vez de `if (!token)`. Sin token la petición se quedaba colgada y con token válido respondía y luego lanzaba error. Se reescribió con `asyncHandler`: sin token o con token inválido responde 401.
- `Controllers/tareasController.js`: en `createTareas` era `if (req.body.descripcion)` → `if (!req.body.descripcion)`. Antes rechazaba las tareas con descripción.
- `routes/tareasRoutes.js`: la ruta de eliminar estaba como `router.put` → `router.delete`.
- `routes/usersRoutes.js`: el registro estaba en `/register` → `/` (queda `POST /api/users`, como pide la actividad).

## Mejoras
- El registro ya no devuelve el password (hash) en la respuesta.
- Login con contraseña incorrecta responde 401 (antes 403).
- `updateTareas` solo modifica `descripcion` (antes se podía cambiar el dueño de la tarea desde el body) y devuelve la tarea ya actualizada.
- `deleteTareas` usa `tarea.deleteOne()`.
- Si otro usuario intenta modificar o eliminar una tarea que no es suya → 403. Si el id no existe o es inválido → 404 (antes un id con mal formato daba 500).
- El middleware valida que el usuario del token todavía exista.
- `config/db.js`: `.cyan,underline` → `.cyan.underline`.
- `package.json`: script `npm start`, `nodemon` como dependencia de desarrollo, se quitó la dependencia `crypt` (no se usaba) y los datos de "MediTime".
- Se agregaron `README.md` y `.env.example`, y `.DS_Store` al `.gitignore`.
