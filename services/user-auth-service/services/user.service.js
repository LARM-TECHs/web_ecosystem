import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Servicio para registrar un nuevo usuario.
 * @param {string} correo - Correo electrónico del nuevo usuario.
 * @param {string} contraseña - Contraseña del nuevo usuario (sin encriptar).
 * @param {string} [rol='estudiante'] - Rol del nuevo usuario.
 * @returns {Promise<object>} Objeto de usuario registrado.
 * @throws {Error} Si el correo ya está registrado o hay un error de base de datos.
 */
export const registerUser = async (correo, contraseña, rol = 'estudiante') => {
    if (!correo || !contraseña) {
        throw new Error('Correo y contraseña son requeridos.');
    }

    const existingUser = await Usuario.findOne({ where: { correo } });
    if (existingUser) {
        throw new Error('El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newUser = await Usuario.create({ correo, contraseña: hashedPassword, rol });

    return newUser;
};

/**
 * Servicio para autenticar un usuario y generar un token JWT.
 * @param {string} correo - Correo electrónico del usuario.
 * @param {string} contraseña - Contraseña del usuario.
 * @returns {Promise<{token: string, usuario: object}>} Objeto con el token y los datos del usuario.
 * @throws {Error} Si las credenciales son inválidas o hay un error de base de datos.
 */
export const loginUser = async (correo, contraseña) => {
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
        throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user);
    return { token, usuario: user };
};
