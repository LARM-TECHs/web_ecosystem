// libreria-service/routes/loanRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    createLoan,
    getAllLoans,
    getLoanById,
    returnLoan,
    getLoansByUserId,
    deleteLoan
} from '../controllers/loanController.js'; // Importa los controladores de préstamo

const router = express.Router();

// Rutas para la gestión de Préstamos

/**
 * @route POST /api/v1/prestamos
 * @description Registra un nuevo préstamo de libro. Accesible para administradores, profesores y estudiantes.
 * @access Privado (Admin, Profesor, Estudiante)
 */
router.post('/', authorizeRoles(['admin', 'profesor', 'estudiante']), createLoan);

/**
 * @route GET /api/v1/prestamos
 * @description Obtiene todos los préstamos (para admin), o solo los del usuario (para profesor/estudiante).
 * @access Privado (Admin, Profesor, Estudiante)
 */
router.get('/', authorizeRoles(['admin', 'profesor', 'estudiante']), getAllLoans);

/**
 * @route GET /api/v1/prestamos/:id_prestamo
 * @description Obtiene un préstamo específico por su ID. Accesible para admin/profesor, o el estudiante dueño.
 * @access Privado (Admin, Profesor, Estudiante)
 */
router.get('/:id_prestamo', authorizeRoles(['admin', 'profesor', 'estudiante']), getLoanById);

/**
 * @route GET /api/v1/prestamos/usuario/:id_usuario
 * @description Obtiene todos los préstamos de un usuario específico. Accesible para admin/profesor, o el propio estudiante.
 * @access Privado (Admin, Profesor, Estudiante)
 */
router.get('/usuario/:id_usuario', authorizeRoles(['admin', 'profesor', 'estudiante']), getLoansByUserId);

/**
 * @route PUT /api/v1/prestamos/:id_prestamo/devolver
 * @description Marca un préstamo como devuelto. Solo accesible para administradores y profesores.
 * @access Privado (Admin, Profesor)
 */
router.put('/:id_prestamo/devolver', authorizeRoles(['admin', 'profesor']), returnLoan);

/**
 * @route DELETE /api/v1/prestamos/:id_prestamo
 * @description Elimina un registro de préstamo. Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.delete('/:id_prestamo', authorizeRoles(['admin']), deleteLoan);

export default router;
