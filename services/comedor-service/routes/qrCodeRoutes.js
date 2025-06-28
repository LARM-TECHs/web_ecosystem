// comedor-service/routes/qrCodeRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    generateOrGetStudentQRCode
} from '../controllers/qrCodeController.js';

const router = express.Router();

/**
 * @route GET /api/v1/students/:studentComedorId/qr
 * @description Genera o recupera un código QR para un estudiante para el menú del día actual.
 * @access Privado (Roles: estudiante (para sí mismo), admin, staff_comedor)
 */
router.get('/students/:studentComedorId/qr', authorizeRoles(['estudiante', 'admin', 'staff_comedor']), generateOrGetStudentQRCode);

export default router;
