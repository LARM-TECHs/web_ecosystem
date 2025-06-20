// server.js (main entry point for chat-llm microservice)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, syncModels } from './config/db.js'; // Importa funciones de DB
import { configureLlm } from './utils/llm.js'; // Importa función para configurar el LLM
import chatRoutes from './routes/chat.routes.js'; // Importa las rutas del chat

// Carga las variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001; // Puerto por defecto para chat-llm

app.use(cors());

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Ruta de bienvenida o salud
app.get('/', (req, res) => {
    res.send('Bienvenido al Microservicio de Chat con LLM');
});

// Rutas del microservicio de chat
// Todas las rutas bajo /api/chat-llm estarán protegidas si usan el middleware.
app.use('/api/chat-llm', chatRoutes);

// Inicialización del servidor
const startServer = async () => {
    try {
        // 1. Conectar y asegurar la base de datos (crear esquema y tablas)
        await connectDB();
        await syncModels();

        // 2. Configurar el modelo LLM (Ollama)
        configureLlm(); // Asegúrate de que Ollama esté corriendo y el modelo descargado

        // 3. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Microservicio de Chat con LLM corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🚨 Error al iniciar el Microservicio de Chat con LLM:', error.message);
        process.exit(1); // Sale de la aplicación si hay un error crítico al iniciar
    }
};

// Inicia el servidor
startServer();
