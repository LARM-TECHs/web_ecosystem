// libreria-service/routes/selectionRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    createSelection,
    getAllSelections,
    getSelectionById,
    updateSelection,
    deleteSelection
} from '../controllers/selectionController.js'; // Importa los controladores de selección

const router = express.Router();

// Rutas para la gestión de Selecciones

/**
 * @route POST /api/v1/selecciones
 * @description Crea un nuevo registro de selección. Accesible para administradores, profesores y estudiantes.
 * @access Privado (Admin, Profesor, Estudiante)
 */
router.post('/', authorizeRoles(['admin', 'profesor', 'estudiante']), createSelection);

/**
 * @route GET /api/v1/selecciones
 * @description Obtiene todas las selecciones. Solo accesible para administradores y profesores (o solo del usuario si es por usuario).
 * @access Privado (Admin, Profesor)
 */
router.get('/', authorizeRoles(['admin', 'profesor']), getAllSelections);

/**
 * @route GET /api/v1/selecciones/:id_seleccion
 * @description Obtiene una selección por su ID. Solo accesible para administradores y profesores (o el usuario dueño).
 * @access Privado (Admin, Profesor)
 */
router.get('/:id_seleccion', authorizeRoles(['admin', 'profesor']), getSelectionById); // Considera si estudiante puede ver solo la suya

/**
 * @route PUT /api/v1/selecciones/:id_seleccion
 * @description Actualiza la información de una selección. Solo accesible para administradores y profesores.
 * @access Privado (Admin, Profesor)
 */
router.put('/:id_seleccion', authorizeRoles(['admin', 'profesor']), updateSelection);

/**
 * @route DELETE /api/v1/selecciones/:id_seleccion
 * @description Elimina un registro de selección. Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.delete('/:id_seleccion', authorizeRoles(['admin']), deleteSelection);

export default router;
