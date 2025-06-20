import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { proxyRequest } from '../utils/proxy.js';

const router = express.Router();
const NOTAS_SERVICE = 'http://localhost:3002';

router.use(verifyToken);

router.get('/', (req, res) => proxyRequest(req, res, `${NOTAS_SERVICE}/notas`));
router.post('/', (req, res) => proxyRequest(req, res, `${NOTAS_SERVICE}/notas`));
router.put('/:id', (req, res) => proxyRequest(req, res, `${NOTAS_SERVICE}/notas/${req.params.id}`));
router.delete('/:id', (req, res) => proxyRequest(req, res, `${NOTAS_SERVICE}/notas/${req.params.id}`));
router.get('/promedio/:id', (req, res) => proxyRequest(req, res, `${NOTAS_SERVICE}/notas/promedio/${req.params.id}`));

export default router;
