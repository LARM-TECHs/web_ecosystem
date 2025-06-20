// notas-estudiantes-service/routes/carreraRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createCarrera,
    getAllCarreras,
    getCarreraById,
    getCarrerasByFacultad,
    getCarreraByName,
    deleteCarrera,
    updateCarrera
} from '../controllers/carreraController.js';

const router = express.Router();

// Rutas para Carreras
router.post('/', authorizeRoles(['admin']), createCarrera);
router.get('/', getAllCarreras);
router.get('/:id_carrera', getCarreraById);
router.get('/facultad/:id_facultad', getCarrerasByFacultad);
router.get('/nombre/:nombre_carrera', getCarreraByName);
router.delete('/:id_carrera', authorizeRoles(['admin']), deleteCarrera);
router.put('/:id_carrera', authorizeRoles(['admin']), updateCarrera);

export default router;