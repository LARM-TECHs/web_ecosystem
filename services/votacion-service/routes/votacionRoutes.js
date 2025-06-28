// votacion-service/routes/votacionRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    createVotacion,
    getActiveVotacion,
    getVotacionById,
    getAllVotaciones,
    updateVotacionEstado,
    deleteVotacion
} from '../controllers/votacionController.js'; // Importa los controladores de votación

const router = express.Router();

// Rutas para la gestión de Votaciones

/**
 * @route POST /api/v1/votaciones
 * @description Crea un nuevo evento de votación. Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.post('/', authorizeRoles(['admin']), createVotacion);

/**
 * @route GET /api/v1/votaciones/activa
 * @description Obtiene el evento de votación que actualmente está activo.
 * @access Autenticado (Cualquier rol) - Generalmente visible para todos los usuarios autenticados.
 */
router.get('/activa', getActiveVotacion);

/**
 * @route GET /api/v1/votaciones/:id_votacion
 * @description Obtiene un evento de votación por su ID.
 * @access Autenticado (Cualquier rol)
 */
router.get('/:id_votacion', getVotacionById);

/**
 * @route GET /api/v1/votaciones
 * @description Obtiene todos los eventos de votación (activos, cerrados, archivados).
 * @access Privado (Admin, Profesor) - Para propósitos de auditoría o administración.
 */
router.get('/', authorizeRoles(['admin', 'profesor']), getAllVotaciones);

/**
 * @route PUT /api/v1/votaciones/:id_votacion/estado
 * @description Actualiza el estado de un evento de votación (abierta, cerrada, archivada).
 * Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.put('/:id_votacion/estado', authorizeRoles(['admin']), updateVotacionEstado);

/**
 * @route DELETE /api/v1/votaciones/:id_votacion
 * @description Elimina un evento de votación por su ID. Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.delete('/:id_votacion', authorizeRoles(['admin']), deleteVotacion);

export default router;
