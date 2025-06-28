// comedor-service/routes/index.js
import express from 'express';
import { authenticateService } from '../middleware/auth.js'; // Importa el middleware de autenticación global

// Importa los routers individuales de cada recurso
import menuRoutes from './menuRoutes.js';
import qrCodeRoutes from './qrCodeRoutes.js';
import studentComedorRoutes from './studentComedorRoutes.js';
import staffComedorRoutes from './staffComedorRoutes.js';

const router = express.Router();

// --- Ruta de Salud del Servicio (Opcional, pero buena práctica) ---
// No requiere autenticación, útil para monitoreo del API Gateway.
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Comedor service is up and running!' });
});

// Aplica el middleware de autenticación a todas las rutas que sigan.
// Esto asegura que cualquier solicitud a los endpoints de la API esté autenticada por el API Gateway.
router.use(authenticateService);

// Monta los routers específicos para cada recurso.
// Todas estas rutas ahora estarán protegidas por `authenticateService`.
// Las autorizaciones por rol se aplican DENTRO de cada router individual.
router.use('/menus', menuRoutes); // Prefijo para rutas de menús
router.use('/qrcodes', qrCodeRoutes); // Prefijo para rutas de QR (generación)
router.use('/students-comedor', studentComedorRoutes); // Prefijo para rutas de estudiantes del comedor
router.use('/staff-comedor', staffComedorRoutes); // Prefijo para rutas de personal del comedor

export default router;
