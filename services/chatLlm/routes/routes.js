import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, Chat } from '../models/index.js'; // Ajusta el path según tu estructura
import { authenticateToken } from '../middleware/auth.js';
import { chatWithLlm } from '../utils/llm.js'; // Ajusta el path si está en otra carpeta


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('❌ FALTA JWT_SECRET en el archivo .env');
}

// --- Middleware de autenticación ---
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.status(401).json({ error: 'Acceso no autorizado. Falta token.' });

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
//         req.user = user;
//         next();
//     });
// }

// --- Registro ---
router.post('/register', async (req, res) => {
    const { name, email, password, user_type = 'user' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos.' });
    }

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ error: 'El correo ya está registrado.' });

        const hash = await bcrypt.hash(password, 10);
        await User.create({ name, email, password, user_type });
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (err) {
        res.status(500).json({ error: `Error en el registro: ${err.message}` });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso.', token });
    } catch (err) {
        res.status(500).json({ error: `Error al iniciar sesión: ${err.message}` });
    }
});

// --- Chat con LLM (simulado) ---
router.post('/chat', authenticateToken, async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });

    try {
        const aiResponse = await chatWithLlm(message); // Aquí iría tu lógica con LangChain, etc.
        const chat = await Chat.create({
            user_id: req.user.id,
            content: message,
            response: aiResponse,
            timestamp: new Date(),
        });

        res.json({
            choices: [{ message: { role: 'assistant', content: aiResponse } }],
            chat_id: chat.id,
        });
    } catch (err) {
        res.status(500).json({ error: `Error al generar la respuesta: ${err.message}` });
    }
});

// --- Listar últimos chats del usuario ---
router.get('/chats', authenticateToken, async (req, res) => {
    try {
        const chats = await Chat.findAll({
            attributes: ['id', 'timestamp'],
            where: { user_id: req.user.id },
            order: [['timestamp', 'DESC']],
            limit: 20,
        });

        res.json({ chats });
    } catch (err) {
        res.status(500).json({ error: `Error al recuperar chats: ${err.message}` });
    }
});

// --- Obtener detalle de un chat específico ---
router.get('/chats/:chat_id', authenticateToken, async (req, res) => {
    const { chat_id } = req.params;

    try {
        const chat = await Chat.findOne({
            where: { id: chat_id, user_id: req.user.id }
        });

        if (!chat) return res.status(404).json({ error: 'Chat no encontrado.' });

        res.json({
            message: chat.content,
            response: chat.response,
            timestamp: chat.timestamp
        });
    } catch (err) {
        res.status(500).json({ error: `Error al recuperar el chat: ${err.message}` });
    }
});

// --- Usuario autenticado actual ---
router.get('/current', authenticateToken, (req, res) => {
    res.json({ email: req.user.email, id: req.user.id });
});

// --- Ruta protegida de prueba ---
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hola, ${req.user.email}. Estás viendo una ruta protegida.` });
});

export default router;
