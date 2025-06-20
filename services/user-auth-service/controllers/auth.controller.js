import * as userService from '../services/user.service.js'; // Importa todas las funciones del servicio

/**
 * Controlador para el registro de usuarios.
 * Recibe los datos del usuario del cuerpo de la petición y llama al servicio correspondiente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const register = async (req, res) => {
    const { correo, contraseña, rol } = req.body;

    try {
        const newUser = await userService.registerUser(correo, contraseña, rol);
        res.status(201).json({ message: 'Usuario registrado correctamente', usuario: newUser });
    } catch (err) {
        console.error('Error en el controlador de registro:', err.message);
        // Manejo de errores específico según el mensaje del servicio
        if (err.message === 'Correo y contraseña son requeridos.' || err.message === 'El correo ya está registrado.') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Error interno al registrar el usuario' });
    }
};

/**
 * Controlador para el inicio de sesión de usuarios.
 * Recibe las credenciales y llama al servicio de autenticación.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const { token, usuario } = await userService.loginUser(correo, contraseña);
        res.json({ token, usuario });
    } catch (err) {
        console.error('Error en el controlador de login:', err.message);
        // Manejo de errores específico según el mensaje del servicio
        if (err.message === 'Credenciales inválidas') {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Error interno al iniciar sesión' });
    }
};
