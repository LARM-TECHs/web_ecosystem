// libreria-service/routes/index.js
import express from 'express';
import { authenticateService } from '../middleware/auth.js'; // Importa el middleware de autenticación global

// Importa los routers individuales de cada recurso
import bookRoutes from './bookRoutes.js';
import loanRoutes from './loanRoutes.js';
import selectionRoutes from './selectionRoutes.js';

const router = express.Router();

// --- Ruta de Salud del Servicio (Opcional, pero buena práctica) ---
// No requiere autenticación, útil para monitoreo del API Gateway.
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Libreria service is up and running!' });
});

// Aplica el middleware de autenticación a todas las rutas que sigan.
// Esto asegura que cualquier solicitud a los endpoints de la API esté autenticada por el API Gateway.
router.use(authenticateService);

// Monta los routers específicos para cada recurso.
// Todas estas rutas ahora estarán protegidas por `authenticateService`.
// Las autorizaciones por rol se aplican DENTRO de cada router individual.
router.use('/libros', bookRoutes); // Prefijo para rutas de libros
router.use('/prestamos', loanRoutes); // Prefijo para rutas de préstamos
router.use('/selecciones', selectionRoutes); // Prefijo para rutas de selecciones

export default router;
