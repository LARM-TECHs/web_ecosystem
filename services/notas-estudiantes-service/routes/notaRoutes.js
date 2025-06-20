// notas-estudiantes-service/routes/notaRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createNota,
    getNotaById,
    getNotasByEstudiante,
    getNotasByEstudianteAndYear,
    getNotaByAsignaturaAndEstudiante,
    deleteNota,
    updateNota,
    getEstudianteAverage
} from '../controllers/notaController.js';

const router = express.Router();

// Rutas para Notas
router.post('/', authorizeRoles(['profesor', 'admin']), createNota);
router.get('/:id_nota', authorizeRoles(['admin', 'profesor', 'estudiante']), getNotaById);
router.get('/estudiante/:id_estudiante_profile', authorizeRoles(['admin', 'profesor', 'estudiante']), getNotasByEstudiante);
router.get('/estudiante/:id_estudiante_profile/año/:año', authorizeRoles(['admin', 'profesor', 'estudiante']), getNotasByEstudianteAndYear);
router.get('/asignatura/:id_asignatura/estudiante/:id_estudiante_profile', authorizeRoles(['admin', 'profesor', 'estudiante']), getNotaByAsignaturaAndEstudiante);
router.delete('/:id_nota', authorizeRoles(['admin', 'profesor']), deleteNota);
router.put('/:id_nota', authorizeRoles(['admin', 'profesor']), updateNota);
router.get('/estudiante/:id_estudiante_profile/promedio', authorizeRoles(['admin', 'profesor', 'estudiante']), getEstudianteAverage);

export default router;