// comedor-service/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'; // Opcional: para logging de requests en desarrollo
import mainRouter from './routes/index.js'; // Importa el router principal
import { connectDB, syncModels } from './config/db.js'; // Importa las funciones de conexión y sincronización de DB

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 3005; // Usa el puerto 3005 para comedor-service

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging de solicitudes solo en desarrollo
}
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// --- Rutas de la API ---
// Todas las rutas del servicio de comedor estarán bajo /api/v1
app.use('/api/v1', mainRouter);

// --- Manejo de errores ---

// Middleware 404: Captura solicitudes a rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada en Comedor Service.' });
});

// Middleware de manejo de errores global: Captura errores en la aplicación
app.use((err, req, res, next) => {
    console.error('Error interno del servidor en Comedor Service:', err); // Log del error para depuración
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// --- Inicio del servidor y conexión a la base de datos ---
const startServer = async () => {
    try {
        // Conectar y asegurar la base de datos y el esquema
        await connectDB();

        // Sincronizar los modelos con la base de datos (crear/actualizar tablas)
        await syncModels();
        console.log('✅ Base de datos para Comedor Service lista y sincronizada.');

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Microservicio de Comedor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🚨 Error crítico al iniciar el Microservicio de Comedor:', error);
        process.exit(1); // Sale de la aplicación si hay un error crítico al iniciar
    }
};

// Inicia el servidor
startServer();
