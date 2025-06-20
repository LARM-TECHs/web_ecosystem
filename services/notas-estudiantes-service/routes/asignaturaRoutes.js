// notas-estudiantes-service/routes/asignaturaRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Solo necesitamos authorizeRoles aquí
import {
    createAsignatura,
    addAsignaturaToCarrera,
    getAllAsignaturas,
    getAsignaturaById,
    getAsignaturaByName,
    getAsignaturasByCarrera,
    getAsignaturaByCarreraAndId,
    deleteAsignatura,
    removeAsignaturaFromCarrera,
    updateAsignatura,
    getAsignaturasByBrigadaCarrera
} from '../controllers/asignaturaController.js';

const router = express.Router();

// Rutas para Asignaturas
router.post('/', authorizeRoles(['admin', 'profesor']), createAsignatura);
router.post('/carrera', authorizeRoles(['admin', 'profesor']), addAsignaturaToCarrera);
router.get('/', getAllAsignaturas);
router.get('/:id_asignatura', getAsignaturaById);
router.get('/nombre/:nombre_asignatura', getAsignaturaByName);
router.get('/carrera/:id_carrera', getAsignaturasByCarrera);
router.get('/carrera/:id_carrera/id/:id_asignatura', getAsignaturaByCarreraAndId);
router.delete('/:id_asignatura', authorizeRoles(['admin']), deleteAsignatura);
router.delete('/carrera/:id_carrera/:id_asignatura', authorizeRoles(['admin']), removeAsignaturaFromCarrera);
router.put('/:id_asignatura', authorizeRoles(['admin', 'profesor']), updateAsignatura);
router.get('/brigada/:id_brigada', getAsignaturasByBrigadaCarrera);

export default router;