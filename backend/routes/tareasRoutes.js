const express = require('express')
const router = express.Router()
const { getTareas, createTareas, updateTareas, deleteTareas } = require('../Controllers/tareasController')
const protect = require('../middleware/authMiddleware')

// Todas las rutas de tareas están protegidas con Bearer Token
router.get('/', protect, getTareas)
router.post('/', protect, createTareas)
router.put('/:id', protect, updateTareas)
router.delete('/:id', protect, deleteTareas)

module.exports = router
