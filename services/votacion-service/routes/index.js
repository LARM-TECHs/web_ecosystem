// votacion-service/routes/index.js
import express from 'express';
import { authenticateService } from '../middleware/auth.js'; // Importa el middleware de autenticación global

// Importa los routers individuales de cada recurso
import votacionRoutes from './votacionRoutes.js';
import candidatoRoutes from './candidatoRoutes.js';
import votoRoutes from './votoRoutes.js';

const router = express.Router();

// --- Ruta de Salud del Servicio (Opcional, pero buena práctica) ---
// No requiere autenticación, útil para monitoreo del API Gateway.
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Votacion service is up and running!' });
});

// Aplica el middleware de autenticación a todas las rutas que sigan.
// Esto asegura que cualquier solicitud a los endpoints de la API esté autenticada por el API Gateway.
router.use(authenticateService);

// Monta los routers específicos para cada recurso.
// Todas estas rutas ahora estarán protegidas por `authenticateService`.
// Las autorizaciones por rol se aplican DENTRO de cada router individual.
router.use('/votaciones', votacionRoutes);
router.use('/candidatos', candidatoRoutes);
router.use('/votos', votoRoutes); // Prefijo para rutas de voto

export default router;
