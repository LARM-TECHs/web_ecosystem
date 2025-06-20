// notas-estudiantes-service/routes/index.js
import express from 'express';
import { authenticateService } from '../middleware/auth.js';

// Importa los routers individuales de cada recurso
import asignaturaRoutes from './asignaturaRoutes.js';
import brigadaRoutes from './brigadaRoutes.js';
import carreraRoutes from './carreraRoutes.js';
import estudianteProfileRoutes from './estudianteProfileRoutes.js';
import facultadRoutes from './facultadRoutes.js';
import notaRoutes from './notaRoutes.js';

const router = express.Router();

// --- Ruta de Salud del Servicio (Opcional, pero buena práctica) ---
// No requiere autenticación, útil para monitoreo.
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Notas Estudiantes service is up and running!' });
});

// Aplica el middleware de autenticación a todas las rutas que sigan.
// Esto asegura que cualquier solicitud a los endpoints de la API esté autenticada.
router.use(authenticateService);

// Monta los routers específicos para cada recurso.
// Todas estas rutas ahora estarán protegidas por `authenticateService`.
router.use('/asignaturas', asignaturaRoutes);
router.use('/brigadas', brigadaRoutes);
router.use('/carreras', carreraRoutes);
router.use('/estudiantes', estudianteProfileRoutes); // Prefijo para perfiles de estudiantes
router.use('/facultades', facultadRoutes);
router.use('/notas', notaRoutes);

export default router;