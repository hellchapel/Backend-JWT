const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { crearUser, loginUser, datosUser } = require('../Controllers/usersControllers')

// Endpoints publicos
router.post('/', crearUser)
router.post('/login', loginUser)

// Endpoint privado
router.get('/datos', protect, datosUser)

module.exports = router
