const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const Tarea = require('../models/tareasModel')

// Busca una tarea por id SOLO si pertenece al usuario del token.
// Si el id no es válido, no existe, o es de otro usuario → 404 (no se revela si existe).
const buscarTareaPropia = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    const tarea = await Tarea.findById(req.params.id)

    if (!tarea) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    // Verificamos que la tarea pertenece al usuario del token
    if (tarea.user.toString() !== req.user.id) {
        res.status(403)
        throw new Error('Acceso no autorizado, la tarea no te pertenece')
    }

    return tarea
}

// GET /api/tareas → solo las tareas del usuario logueado
const getTareas = asyncHandler(async (req, res) => {
    const tareas = await Tarea.find({ user: req.user.id })
    res.status(200).json(tareas)
})

// POST /api/tareas → la tarea se asigna al usuario del token
const createTareas = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.descripcion) {
        res.status(400)
        throw new Error('Debes teclear una descripcion')
    }

    const tarea = await Tarea.create({
        user: req.user.id,
        descripcion: req.body.descripcion
    })

    res.status(201).json(tarea)
})

// PUT /api/tareas/:id → solo el dueño puede modificarla
const updateTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaPropia(req, res)

    if (!req.body || !req.body.descripcion) {
        res.status(400)
        throw new Error('Debes teclear una descripcion')
    }

    // Solo se actualiza la descripción; el dueño (user) nunca se cambia desde el body
    tarea.descripcion = req.body.descripcion
    const tareaUpdated = await tarea.save()

    res.status(200).json(tareaUpdated)
})

// DELETE /api/tareas/:id → solo el dueño puede eliminarla
const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaPropia(req, res)

    await tarea.deleteOne()
    res.status(200).json({ id: req.params.id })
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
