// notas-estudiantes-service/routes/facultadRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createFacultad,
    getAllFacultades,
    getFacultadById,
    getFacultadByName,
    deleteFacultad,
    updateFacultad
} from '../controllers/facultadController.js';

const router = express.Router();

// Rutas para Facultades
router.post('/', authorizeRoles(['admin']), createFacultad);
router.get('/', getAllFacultades);
router.get('/:id_facultad', getFacultadById);
router.get('/nombre/:nombre_facultad', getFacultadByName);
router.delete('/:id_facultad', authorizeRoles(['admin']), deleteFacultad);
router.put('/:id_facultad', authorizeRoles(['admin']), updateFacultad);

export default router;