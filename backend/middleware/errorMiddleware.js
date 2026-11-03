const errorHandler = (err, req, res, next) => {
    // Si el controlador ya puso un código de error (400, 401, 404...) se respeta;
    // si no, es un error inesperado del servidor (500)
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler
