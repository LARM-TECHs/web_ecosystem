import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js'; // Importa desde el controlador renombrado
import { authenticate } from '../middleware/auth.middleware.js'; // Importa el middleware de autenticación

const router = Router();

/**
 * Ruta para el inicio de sesión de usuarios.
 * Método: POST
 * Endpoint: /login
 */
router.post('/login', login);

/**
 * Ruta para el registro de nuevos usuarios.
 * Método: POST
 * Endpoint: /register
 */
router.post('/register', register);

/**
 * Ruta de ejemplo protegida por autenticación.
 * Requiere un token JWT válido en el encabezado de autorización.
 * Método: GET
 * Endpoint: /profile
 */
router.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'Acceso a perfil exitoso',
        user: req.user, // La información del usuario proviene del middleware authenticate
        data: 'Esta es información confidencial del perfil.'
    });
});

export default router;
