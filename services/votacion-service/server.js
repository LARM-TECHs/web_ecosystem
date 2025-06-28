// votacion-service/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import morgan from 'morgan'; // Opcional: para logging de requests
import mainRouter from './routes/index.js'; // Importa el router principal
import db from './models/index.js'; // Importa el objeto db de models/index.js
import { connectDB, syncModels } from './config/db.js'; // Importa las funciones de conexión y sincronización de DB

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 3003; // Usa el puerto 3003 para votacion-service

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes
// app.use(morgan('dev')); // Descomenta para logging de solicitudes en desarrollo
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// --- Configuración de Multer para la subida de fotos de candidatos ---
// Para manejar la subida de archivos, necesitarás un middleware como `multer`.
// Asegúrate de crear la carpeta `uploads/candidatos` si la usas.
// Ejemplo básico (requiere `npm install multer`):
/*
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname no está disponible en módulos ES, así que lo recreamos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que este directorio exista
        cb(null, path.join(__dirname, '..', 'uploads', 'candidatos'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Si la subida es para un endpoint específico, se aplica a la ruta:
// router.post('/candidatos', authorizeRoles(['admin', 'profesor']), upload.single('foto'), createCandidate);
// Para que '/uploads' sea accesible estáticamente:
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
*/
// Si no vas a usar subida de archivos localmente, puedes ignorar lo anterior.
// Si las fotos se manejan en un S3/Cloud Storage, este middleware no es necesario.


// --- Rutas de la API ---
// Todas las rutas del servicio de votación estarán bajo /api/v1
app.use('/api/v1', mainRouter);

// --- Manejo de errores ---

// Middleware 404: Captura solicitudes a rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global: Captura errores en la aplicación
app.use((err, req, res, next) => {
    console.error('Error interno del servidor:', err); // Log del error para depuración
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// --- Inicio del servidor y conexión a la base de datos ---
const startServer = async () => {
    try {
        // Conectar y asegurar la base de datos y el esquema
        await connectDB();

        // Sincronizar los modelos con la base de datos (crear/actualizar tablas)
        // La función syncModels importada desde config/db.js ya importa los modelos
        // y llama a sequelize.sync().
        await syncModels();
        console.log('✅ Base de datos lista.');

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Microservicio de Votación ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🚨 Error crítico al iniciar el Microservicio de Votación:', error);
        process.exit(1); // Sale de la aplicación si hay un error crítico al iniciar
    }
};

// Inicia el servidor
startServer();
