// user-auth-service/utils/jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera un JSON Web Token (JWT) para un usuario dado.
 * El token incluye el ID, correo y rol del usuario, y expira según la configuración.
 * @param {object} usuario - Objeto de usuario con id, correo y rol (debe tener 'id' como PK).
 * @returns {string} El token JWT generado.
 */
export const generateToken = (usuario) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        console.error('Error: JWT_SECRET o JWT_EXPIRES_IN no están definidos en las variables de entorno.');
        throw new Error('Configuración de JWT incompleta.');
    }

    // --- CORRECCIÓN AQUÍ ---
    // Preferimos 'usuario.id' si es la clave primaria por defecto de Sequelize.
    // Si tu modelo usa 'id_usuario' como nombre de la PK, 'usuario.id_usuario' sería correcto.
    // Usamos un fallback para mayor robustez.
    const userId = usuario.id || usuario.id_usuario; // Asegura que se capture el ID correcto

    // Asegurarse de que el ID no sea nulo antes de firmar el token
    if (!userId) {
        console.error('Error: ID de usuario no disponible para generar el token. Revise la estructura del modelo Usuario.');
        throw new Error('ID de usuario faltante para JWT.');
    }

    return jwt.sign(
        {
            id: userId, // Usar el ID del usuario obtenido correctamente
            correo: usuario.correo,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

/**
 * Verifica un JSON Web Token (JWT).
 * Si el token es válido y no ha expirado, devuelve el payload decodificado.
 * @param {string} token - El token JWT a verificar.
 * @returns {object|null} El payload del token si es válido, o null si hay un error.
 */
export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        console.error('Error: JWT_SECRET no está definido en las variables de entorno.');
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error('Error al verificar el token:', err.message);
        return null;
    }
};
