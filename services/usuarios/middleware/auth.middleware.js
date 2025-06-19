import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) return res.status(403).json({ message: 'Token inválido o expirado' });

    req.user = payload;
    next();
};
