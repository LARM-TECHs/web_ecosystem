// votacion-service/routes/votoRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    castVote,
    getVotacionResults,
    getVotesByUser
} from '../controllers/votoController.js'; // Importa los controladores de voto

const router = express.Router();

// Rutas para la gestión de Votos

/**
 * @route POST /api/v1/votar
 * @description Permite a un usuario (estudiante) emitir su voto en una elección activa.
 * @access Privado (Estudiante)
 */
router.post('/', authorizeRoles(['estudiante']), castVote);

/**
 * @route GET /api/v1/votaciones/:id_votacion/resultados
 * @description Obtiene los resultados de una votación específica.
 * @access Autenticado (Cualquier rol) - Los resultados podrían ser públicos o solo para roles específicos, ajustar `authorizeRoles` según política.
 */
router.get('/:id_votacion/resultados', getVotacionResults); // Considera authorizeRoles si los resultados no son públicos

/**
 * @route GET /api/v1/votaciones/:id_votacion/votos-por-usuario
 * @description Obtiene todos los registros de votos de usuarios para una votación específica.
 * Útil para auditoría.
 * @access Privado (Admin)
 */
router.get('/:id_votacion/votos-por-usuario', authorizeRoles(['admin']), getVotesByUser);

export default router;
