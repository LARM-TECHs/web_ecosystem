// notas-estudiantes-service/routes/brigadaRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createBrigada,
    getAllBrigadas,
    getBrigadaById,
    getBrigadasByCarrera,
    getBrigadaByName,
    deleteBrigada,
    updateBrigada
} from '../controllers/brigadaController.js';

const router = express.Router();

// Rutas para Brigadas
router.post('/', authorizeRoles(['admin', 'profesor']), createBrigada);
router.get('/', getAllBrigadas);
router.get('/:id_brigada', getBrigadaById);
router.get('/carrera/:id_carrera', getBrigadasByCarrera);
router.get('/nombre/:nombre_brigada', getBrigadaByName);
router.delete('/:id_brigada', authorizeRoles(['admin']), deleteBrigada);
router.put('/:id_brigada', authorizeRoles(['admin', 'profesor']), updateBrigada);

export default router;