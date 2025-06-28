// comedor-service/routes/menuRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import {
    createOrUpdateMenu,
    getMenuForToday,
    getMenuByDate,
    getAllMenus,
    deleteMenuByDate
} from '../controllers/menuController.js';

const router = express.Router();

/**
 * @route POST /api/v1/menus
 * @description Crea un nuevo menú o actualiza uno existente para una fecha dada.
 * @access Privado (Roles: admin, staff_comedor)
 */
router.post('/', authorizeRoles(['admin', 'staff_comedor']), createOrUpdateMenu);

/**
 * @route GET /api/v1/menus/today
 * @description Obtiene el menú del día actual. Si no existe, crea uno por defecto.
 * @access Autenticado (Cualquier rol)
 */
router.get('/today', getMenuForToday);

/**
 * @route GET /api/v1/menus/:date
 * @description Obtiene el menú para una fecha específica.
 * @access Autenticado (Cualquier rol)
 */
router.get('/:date', getMenuByDate);

/**
 * @route GET /api/v1/menus
 * @description Obtiene todos los menús (o los más recientes, con límite).
 * @access Privado (Roles: admin, staff_comedor)
 */
router.get('/', authorizeRoles(['admin', 'staff_comedor']), getAllMenus);

/**
 * @route DELETE /api/v1/menus/:date
 * @description Elimina un menú por su fecha.
 * @access Privado (Roles: admin)
 */
router.delete('/:date', authorizeRoles(['admin']), deleteMenuByDate);

export default router;
