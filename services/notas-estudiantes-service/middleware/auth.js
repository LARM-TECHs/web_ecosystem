// notas-estudiantes-service/middleware/auth.js
// No se necesita importar 'jsonwebtoken' ni 'dotenv' aquí,
// ya que la verificación del JWT la realiza el API Gateway.

/**
 * Middleware para asegurar que la solicitud ha sido autenticada por el API Gateway.
 * Verifica la presencia de los headers de usuario inyectados por el Gateway.
 *
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
export const authenticateService = (req, res, next) => {
    // El API Gateway debe inyectar 'x-user-id', 'x-user-correo', 'x-user-rol'
    // en minúsculas en los headers de la solicitud.
    const userId = req.headers['x-user-id'];
    const userCorreo = req.headers['x-user-correo'];
    const userRol = req.headers['x-user-rol'];

    if (!userId || !userCorreo || !userRol) {
        // Esto indica que la solicitud no fue autenticada por el Gateway
        // o que los headers esperados no fueron inyectados.
        // En un entorno de producción, esto es un error de configuración del Gateway
        // o un intento de acceso no autorizado bypassando el Gateway.
        console.warn('Authentication Warning: Request to notas-estudiantes-service missing expected user headers from API Gateway.');
        return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
    }

    // Adjuntar la información del usuario a `req.user` para fácil acceso en los controladores
    req.user = {
        id: userId,
        correo: userCorreo,
        rol: userRol
    };

    next();
};

/**
 * Middleware para autorizar el acceso basado en roles.
 * Debe ser usado DESPUÉS de authenticateService.
 *
 * @param {Array<string>} allowedRoles - Un array de roles permitidos (ej. ['admin', 'profesor']).
 * @returns {function} Middleware function.
 */
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            // Esto no debería suceder si authenticateService se usa primero,
            // pero es una salvaguarda.
            return res.status(403).json({ message: 'Acceso denegado: Rol de usuario no disponible.' });
        }

        const userRol = req.user.rol;

        if (allowedRoles.includes(userRol)) {
            next(); // El rol del usuario está permitido
        } else {
            console.warn(`Authorization Warning: User with role '${userRol}' attempted to access a route requiring roles: ${allowedRoles.join(', ')}.`);
            return res.status(403).json({ message: 'Acceso denegado: No tiene los permisos necesarios para realizar esta acción.' });
        }
    };
};