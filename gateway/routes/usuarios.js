import express from 'express';
import { proxyRequest } from '../utils/proxy.js';

const router = express.Router();
const USUARIOS_SERVICE = 'http://localhost:4000';

// Redirige a /api/auth/login
router.post('/login', (req, res) => {
  proxyRequest(req, res, `${USUARIOS_SERVICE}/api/auth/login`);
});

router.post('/register', (req, res) => {
  proxyRequest(req, res, `${USUARIOS_SERVICE}/api/auth/register`);
});

export default router;
