import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, syncDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Define el puerto del servidor

app.use(cors());

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta de bienvenida o salud
app.get('/', (req, res) => {
    res.send('Bienvenido al Microservicio de Usuarios');
});

// Inicialización del servidor
const startServer = async () => {
    try {
        await connectDB(); // Intenta conectar a la base de datos
        await syncDB();    // Sincroniza los modelos con la base de datos (crea tablas si no existen)

        app.listen(PORT, () => {
            console.log(`🚀 Microservicio de Usuarios corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🚨 Error al iniciar el servidor:', error);
        process.exit(1); // Sale de la aplicación si hay un error crítico al iniciar
    }
};

// Inicia el servidor
startServer();
