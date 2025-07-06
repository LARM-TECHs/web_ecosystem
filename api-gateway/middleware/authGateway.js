import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to authenticate requests using a JWT at the API Gateway.
 * It can read the token from the 'Authorization: Bearer' header OR
 * from a 'token' query parameter (useful for EventSource/SSE clients).
 *
 * If the token is valid, it attaches user info to req.user and passes it to the next handler.
 * It also strips the Authorization header before forwarding to downstream services,
 * and adds X-User-ID, X-User-Correo, X-User-Rol headers.
 */
export const authenticateGateway = (req, res, next) => {
    let token = null;
    const authHeader = req.headers.authorization;

    // 1. Intentar obtener el token del header
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Si no está en el header, intentar obtenerlo de los query params
    else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload to req.user

        // Inject user info into headers for downstream services
        req.headers['x-user-id'] = decoded.id;
        req.headers['x-user-correo'] = decoded.correo;
        req.headers['x-user-rol'] = decoded.rol;

        // Remove the Authorization header to prevent downstream services from re-verifying
        if (req.headers.authorization) {
            delete req.headers.authorization;
        }

        next();
    } catch (err) {
        console.error('Error al verificar el token en el API Gateway:', err.message);
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};
