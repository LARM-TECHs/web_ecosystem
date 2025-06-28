// libreria-service/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import morgan from 'morgan'; // Opcional: para logging de requests
import mainRouter from './routes/index.js'; // Importa el router principal
// No necesitamos importar 'db' directamente aquí si connectDB y syncModels ya lo gestionan
import { connectDB, syncModels } from './config/db.js'; // Importa las funciones de conexión y sincronización de DB

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 3004; // Usa el puerto 3004 para libreria-service

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes
// app.use(morgan('dev')); // Descomenta para logging de solicitudes en desarrollo
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// --- Configuración opcional para subida de archivos (ej. Multer para portadas de libros) ---
// Si necesitas manejar la subida de archivos (ej. fotos de portada para libros),
// necesitarás un middleware como `multer` y configurar un directorio para los uploads.
// Ejemplo básico (requiere `npm install multer`):
/*
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname no está disponible en módulos ES, así que lo recreamos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'libros');
// Asegúrate de que este directorio exista, o créalo programáticamente si es necesario
// import fs from 'fs';
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
export const upload = multer({ storage: storage });

// Para que la carpeta 'uploads' sea accesible estáticamente (ej. para servir imágenes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
*/
// Si no vas a usar subida de archivos localmente, puedes ignorar lo anterior.
// Si las fotos se manejan en un S3/Cloud Storage, este middleware no es necesario aquí.


// --- Rutas de la API ---
// Todas las rutas del servicio de librería estarán bajo /api/v1
app.use('/api/v1', mainRouter);

// --- Manejo de errores ---

// Middleware 404: Captura solicitudes a rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global: Captura errores en la aplicación
app.use((err, req, res, next) => {
    console.error('Error interno del servidor en Libreria Service:', err); // Log del error para depuración
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// --- Inicio del servidor y conexión a la base de datos ---
const startServer = async () => {
    try {
        // Conectar y asegurar la base de datos y el esquema
        await connectDB();

        // Sincronizar los modelos con la base de datos (crear/actualizar tablas)
        await syncModels();
        console.log('✅ Base de datos para Libreria Service lista.');

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Microservicio de Librería ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🚨 Error crítico al iniciar el Microservicio de Librería:', error);
        process.exit(1); // Sale de la aplicación si hay un error crítico al iniciar
    }
};

// Inicia el servidor
startServer();
