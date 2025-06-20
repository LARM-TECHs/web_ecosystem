import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware para autenticar peticiones mediante un token JWT.
 * Verifica la existencia y validez del token en el encabezado de autorización.
 * Si el token es válido, adjunta la información del usuario a `req.user` y permite el acceso.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado o formato incorrecto.' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token de "Bearer <token>"
    const payload = verifyToken(token); // Verifica el token

    if (!payload) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

    req.user = payload; // Adjunta el payload del token al objeto de solicitud
    next(); // Pasa al siguiente middleware o ruta
};
