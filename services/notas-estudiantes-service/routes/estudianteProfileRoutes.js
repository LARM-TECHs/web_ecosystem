// notas-estudiantes-service/routes/estudianteProfileRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createEstudianteProfile,
    getAllEstudianteProfiles,
    getEstudianteProfileById,
    getMyEstudianteProfile,
    getEstudianteProfileByUserId,
    getEstudiantesByBrigada,
    updateEstudianteProfile,
    deleteEstudianteProfile
} from '../controllers/estudianteProfileController.js';

const router = express.Router();

// Rutas para Perfiles de Estudiantes
router.post('/', authorizeRoles(['admin']), createEstudianteProfile);
router.get('/', authorizeRoles(['admin', 'profesor']), getAllEstudianteProfiles);
router.get('/me', authorizeRoles(['estudiante']), getMyEstudianteProfile); // Ruta específica para el perfil del estudiante autenticado
router.get('/:id_estudiante_profile', authorizeRoles(['admin', 'profesor', 'estudiante']), getEstudianteProfileById);
router.get('/usuario/:id_usuario', authorizeRoles(['admin', 'profesor']), getEstudianteProfileByUserId); // Obtener por ID de usuario del servicio de usuarios
router.get('/brigada/:id_brigada', authorizeRoles(['admin', 'profesor']), getEstudiantesByBrigada);
router.put('/:id_estudiante_profile', authorizeRoles(['admin', 'estudiante']), updateEstudianteProfile);
router.delete('/:id_estudiante_profile', authorizeRoles(['admin']), deleteEstudianteProfile);

export default router;