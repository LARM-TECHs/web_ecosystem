// comedor-service/routes/staffComedorRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    registerStaffComedor,
    getAllStaffComedor,
    getStaffComedorById,
    updateStaffComedor,
    deleteStaffComedor,
    validateQrCode,
    getQrHistory,
    getQrCodeDetails
} from '../controllers/staffController.js';

const router = express.Router();

/**
 * @route POST /api/v1/staff-comedor
 * @description Registra un nuevo miembro del personal en el sistema del comedor.
 * @access Privado (Roles: admin)
 */
router.post('/', authorizeRoles(['admin']), registerStaffComedor);

/**
 * @route GET /api/v1/staff-comedor
 * @description Obtiene todos los miembros del personal registrados.
 * @access Privado (Roles: admin)
 */
router.get('/', authorizeRoles(['admin']), getAllStaffComedor);

/**
 * @route GET /api/v1/staff-comedor/:id
 * @description Obtiene un miembro del personal por su ID interno.
 * @access Privado (Roles: admin)
 */
router.get('/:id', authorizeRoles(['admin']), getStaffComedorById);

/**
 * @route PUT /api/v1/staff-comedor/:id
 * @description Actualiza la información de un miembro del personal.
 * @access Privado (Roles: admin)
 */
router.put('/:id', authorizeRoles(['admin']), updateStaffComedor);

/**
 * @route DELETE /api/v1/staff-comedor/:id
 * @description Elimina un miembro del personal.
 * @access Privado (Roles: admin)
 */
router.delete('/:id', authorizeRoles(['admin']), deleteStaffComedor);

/**
 * @route POST /api/v1/staff-comedor/validate-qr
 * @description Permite al personal validar un código QR presentado por un estudiante.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.post('/validate-qr', authorizeRoles(['admin', 'staff_comedor']), validateQrCode);

/**
 * @route GET /api/v1/staff-comedor/qr-history
 * @description Obtiene el historial de uso de códigos QR, con filtros opcionales.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.get('/qr-history', authorizeRoles(['admin', 'staff_comedor']), getQrHistory);

/**
 * @route GET /api/v1/staff-comedor/qrcodes/:qrId
 * @description Obtiene los detalles de un QR específico.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.get('/qrcodes/:qrId', authorizeRoles(['admin', 'staff_comedor']), getQrCodeDetails);

export default router;
