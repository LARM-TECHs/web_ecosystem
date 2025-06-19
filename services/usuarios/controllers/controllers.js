import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
    const { correo, contraseña, rol } = req.body;

    try {
        const existing = await Usuario.findOne({ where: { correo } });
        if (existing) return res.status(400).json({ message: 'El correo ya está registrado.' });

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = await Usuario.create({ correo, contraseña: hashedPassword, rol });

        res.status(201).json({ message: 'Usuario registrado correctamente', usuario: nuevoUsuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// export const login = async (req, res) => {
//     const { correo, contraseña } = req.body;

//     try {
//         const usuario = await Usuario.findOne({ where: { correo } });
//         if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

//         const match = await bcrypt.compare(contraseña, usuario.contraseña);
//         if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

//         const token = generateToken(usuario);
//         res.json({ token, usuario });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error al iniciar sesión' });
//     }
// };

export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        console.log('➡️ Intentando login con:', correo);
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const match = await bcrypt.compare(contraseña, usuario.contraseña);
        console.log('🔍 Resultado bcrypt:', match);

        if (!match) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(usuario);
        res.json({ token, usuario });
    } catch (err) {
        console.error('🔥 Error al iniciar sesión:', err);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};
