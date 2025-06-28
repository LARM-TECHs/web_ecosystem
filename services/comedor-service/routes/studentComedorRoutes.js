// comedor-service/routes/studentComedorRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    registerStudentComedor,
    getAllStudentsComedor,
    getMyStudentComedorProfile,
    getStudentComedorById,
    updateStudentComedor,
    deleteStudentComedor
} from '../controllers/studentComedorController.js';

const router = express.Router();

/**
 * @route POST /api/v1/students-comedor
 * @description Registra un nuevo estudiante en el sistema del comedor.
 * @access Privado (Roles: admin, estudiante)
 */
router.post('/', authorizeRoles(['admin', 'estudiante']), registerStudentComedor);

/**
 * @route GET /api/v1/students-comedor
 * @description Obtiene todos los estudiantes registrados en el sistema del comedor.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.get('/', authorizeRoles(['admin', 'staff_comedor']), getAllStudentsComedor);

/**
 * @route GET /api/v1/students-comedor/me
 * @description Obtiene el perfil del estudiante del comedor asociado al usuario autenticado.
 * @access Privado (Roles: estudiante)
 */
router.get('/me', authorizeRoles(['estudiante']), getMyStudentComedorProfile);

/**
 * @route GET /api/v1/students-comedor/:id
 * @description Obtiene un estudiante del comedor por su ID interno.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.get('/:id', authorizeRoles(['admin', 'staff_comedor']), getStudentComedorById);

/**
 * @route PUT /api/v1/students-comedor/:id
 * @description Actualiza la información de un estudiante del comedor.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.put('/:id', authorizeRoles(['admin', 'staff_comedor']), updateStudentComedor);

/**
 * @route DELETE /api/v1/students-comedor/:id
 * @description Elimina un estudiante del sistema del comedor.
 * @access Privado (Roles: admin)
 */
router.delete('/:id', authorizeRoles(['admin']), deleteStudentComedor);

export default router;
