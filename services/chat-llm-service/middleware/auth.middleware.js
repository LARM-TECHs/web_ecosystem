// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// /**
//  * Middleware para autenticar peticiones mediante un token JWT
//  * emitido por el user-auth-service.
//  * Verifica la existencia y validez del token en el encabezado de autorización.
//  * Si el token es válido, adjunta la información del usuario (id, correo, rol)
//  * a `req.user` y permite el acceso.
//  *
//  * @param {object} req - Objeto de solicitud de Express.
//  * @param {object} res - Objeto de respuesta de Express.
//  * @param {function} next - Función para pasar al siguiente middleware.
//  */
// export const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Token de autenticación no proporcionado o formato incorrecto.' });
//     }

//     const token = authHeader.split(' ')[1]; // Extrae el token de "Bearer <token>"

//     if (!process.env.JWT_SECRET) {
//         console.error('Error: JWT_SECRET no está definido en las variables de entorno para el servicio chat-llm.');
//         return res.status(500).json({ message: 'Error de configuración del servidor.' });
//     }

//     try {
//         // Verifica el token usando la misma clave secreta que el user-auth-service
//         const payload = jwt.verify(token, process.env.JWT_SECRET);

//         // Se espera que el payload contenga 'id', 'correo', 'rol' del user-auth-service
//         req.user = {
//             id: payload.id,        // Corresponde a id_usuario del user-auth-service
//             email: payload.correo, // Corresponde a correo del user-auth-service
//             role: payload.rol      // Corresponde a rol del user-auth-service
//         };
//         next(); // Pasa al siguiente middleware o ruta

//     } catch (err) {
//         console.error('Error al verificar el token en chat-llm:', err.message);
//         // Diferencia entre token inválido y expirado
//         if (err.name === 'TokenExpiredError') {
//             return res.status(403).json({ message: 'Token expirado.' });
//         }
//         return res.status(403).json({ message: 'Token inválido.' });
//     }
// };
