import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { proxyRequest } from '../utils/proxy.js';

const router = express.Router();
const CHAT_SERVICE = 'http://localhost:3003';

router.use(verifyToken); // protegemos las rutas con JWT

router.post('/', (req, res) => {
    proxyRequest(req, res, `${CHAT_SERVICE}/chat`);
});

export default router;
