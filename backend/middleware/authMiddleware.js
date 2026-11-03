const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    // Sin header Authorization: Bearer <token> → 401
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401)
        throw new Error('Acceso no autorizado, no se proporciono ningun token')
    }

    // Obtenemos el token
    const token = authHeader.split(' ')[1]

    // Verificamos el token (si fue alterado o expiró, jwt.verify lanza error)
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        res.status(401)
        throw new Error('Acceso no autorizado, token invalido')
    }

    // Obtenemos la info del usuario dueño del token (sin el password)
    req.user = await User.findById(decoded.id_usuario).select('-password')

    if (!req.user) {
        res.status(401)
        throw new Error('Acceso no autorizado, el usuario ya no existe')
    }

    next()
})

module.exports = protect
