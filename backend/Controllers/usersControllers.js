const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

// POST /api/users → registrar usuario
const crearUser = asyncHandler(async (req, res) => {
    // Desestructuramos el body
    const { nombre, email, password } = req.body || {}

    // Validamos que nos pasen los datos requeridos
    if (!nombre || !email || !password) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    // Verificamos que el correo no esté registrado
    const userExiste = await User.findOne({ email })
    if (userExiste) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    }

    // Hacemos el hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Creamos el usuario
    const user = await User.create({
        nombre,
        email,
        password: hashedPassword
    })

    if (user) {
        // No se devuelve el password (ni siquiera el hash)
        res.status(201).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('No se pudieron guardar los datos')
    }
})

// POST /api/users/login → iniciar sesión y devolver el JWT
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {}

    if (!email || !password) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    // Verificamos que el usuario existe
    const user = await User.findOne({ email })

    // Verificamos el password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id)
        })
    } else {
        res.status(401)
        throw new Error('Credenciales incorrectas')
    }
})

// GET /api/users/datos → datos del usuario dueño del token
const datosUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// El payload del token guarda el id del usuario
const generarToken = (id_usuario) => {
    return jwt.sign({ id_usuario }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    crearUser, loginUser, datosUser
}
