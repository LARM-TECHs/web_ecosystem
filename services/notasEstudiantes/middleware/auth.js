// middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ message: "No existe el token" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
