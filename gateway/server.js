import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';
import notasRoutes from './routes/notas.js';
// import materiasRoutes from './routes/materias.js';
import chatRoutes from './routes/chat.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas públicas y privadas
app.use('/usuarios', usuariosRoutes); // registro/login públicos
app.use('/notas', notasRoutes);       // protegidas con JWT
// app.use('/materias', materiasRoutes); // protegidas con JWT
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 API Gateway corriendo en http://localhost:${PORT}`);
});
