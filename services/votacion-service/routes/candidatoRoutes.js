// votacion-service/routes/candidatoRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    getAllCandidates,
    searchCandidateByName,
    getCandidatesByVotacion,
    createCandidate,
    updateCandidate, // Añadido para la ruta de actualización
    deleteCandidate
} from '../controllers/candidateController.js'; // Importa los controladores de candidato
// Si usas multer para la subida de archivos, necesitarías importarlo aquí
// import multer from 'multer';
// const upload = multer({ dest: 'uploads/candidatos/' }); // Configura tu destino de subida

const router = express.Router();

// Rutas para la gestión de Candidatos

/**
 * @route GET /api/v1/candidatos
 * @description Obtiene todos los candidatos.
 * @access Autenticado (Cualquier rol)
 */
router.get('/', getAllCandidates);

/**
 * @route GET /api/v1/candidatos/buscarPorNombre
 * @description Busca un candidato por nombre.
 * @access Autenticado (Cualquier rol)
 */
router.get('/buscarPorNombre', searchCandidateByName); // Usa req.query

/**
 * @route GET /api/v1/candidatos/porVotacion/:id_votacion
 * @description Obtiene candidatos para una votación específica.
 * @access Autenticado (Cualquier rol)
 */
router.get('/porVotacion/:id_votacion', getCandidatesByVotacion);

/**
 * @route POST /api/v1/candidatos
 * @description Crea un nuevo candidato. Incluye subida de foto.
 * @access Privado (Admin, Profesor)
 * @notes Si usas multer, la ruta sería: `router.post('/', authorizeRoles(['admin', 'profesor']), upload.single('foto'), createCandidate);`
 */
router.post('/', authorizeRoles(['admin', 'profesor']), createCandidate); // Asume que el middleware de Multer se manejará a nivel superior o aquí si aplica.

/**
 * @route PUT /api/v1/candidatos/:id_candidato
 * @description Actualiza la información de un candidato. Incluye posible actualización de foto.
 * @access Privado (Admin, Profesor)
 * @notes Si usas multer, la ruta sería: `router.put('/:id_candidato', authorizeRoles(['admin', 'profesor']), upload.single('foto'), updateCandidate);`
 */
router.put('/:id_candidato', authorizeRoles(['admin', 'profesor']), updateCandidate); // Asume Multer.

/**
 * @route DELETE /api/v1/candidatos/:id_candidato
 * @description Elimina un candidato por su ID.
 * @access Privado (Admin)
 */
router.delete('/:id_candidato', authorizeRoles(['admin']), deleteCandidate);

export default router;
