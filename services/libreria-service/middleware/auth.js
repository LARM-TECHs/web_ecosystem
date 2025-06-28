// libreria-service/middleware/auth.js
// No es necesario importar 'jsonwebtoken' ni 'dotenv' aquí,
// ya que la verificación del JWT y la carga de variables de entorno
// las realiza el API Gateway y el archivo db.js/server.js, respectivamente.

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
    // en minúsculas en los headers de la solicitud después de verificar el JWT.
    const userId = req.headers['x-user-id'];
    const userCorreo = req.headers['x-user-correo'];
    const userRol = req.headers['x-user-rol'];

    if (!userId || !userCorreo || !userRol) {
        // Esto indica que la solicitud no fue autenticada por el Gateway (posible bypass)
        // o que los headers esperados no fueron inyectados.
        console.warn('Authentication Warning: Request to libreria-service missing expected user headers from API Gateway.');
        return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
    }

    // Adjuntar la información del usuario a `req.user` para fácil acceso en los controladores y middlewares siguientes
    req.user = {
        id: userId,
        correo: userCorreo,
        rol: userRol
    };

    next(); // Pasa al siguiente middleware o controlador en la cadena
};

/**
 * Middleware para autorizar el acceso basado en roles.
 * Debe ser usado DESPUÉS de `authenticateService` en la cadena de middlewares de la ruta.
 *
 * @param {Array<string>} allowedRoles - Un array de roles permitidos para acceder a esta ruta (ej. ['admin', 'profesor']).
 * @returns {function} Una función middleware que se usará en las rutas.
 */
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        // Se asume que `req.user` ya ha sido poblado por `authenticateService`.
        if (!req.user || !req.user.rol) {
            // Esto es una salvaguarda. Si `authenticateService` se usa primero, `req.user` debería existir.
            console.warn('Authorization Warning: User information (role) not available for authorization check in libreria-service.');
            return res.status(403).json({ message: 'Acceso denegado: Rol de usuario no disponible.' });
        }

        const userRol = req.user.rol; // Obtiene el rol del usuario autenticado

        // Verifica si el rol del usuario está incluido en los roles permitidos
        if (allowedRoles.includes(userRol)) {
            next(); // El rol del usuario está permitido, procede
        } else {
            console.warn(`Authorization Warning: User with role '${userRol}' attempted to access a route requiring roles: ${allowedRoles.join(', ')} in libreria-service.`);
            return res.status(403).json({ message: 'Acceso denegado: No tiene los permisos necesarios para realizar esta acción.' });
        }
    };
};
