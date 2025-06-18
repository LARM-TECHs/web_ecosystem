// server.js o app.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importa la función para sincronizar modelos y la instancia de sequelize
import { syncModels } from './models/index.js'; // O la ruta correcta

// Importa tus rutas
import routes from './routes/routes.js'; // Asegúrate que la extensión y ruta sean correctas
import { configureLlm } from './utils/llm.js';
configureLlm();


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar las rutas
app.use('/api', routes);

// Iniciar conexión a DB y luego el servidor
(async () => {
    try {
        await syncModels(); // 🔄 Conexión y sincronización
        app.listen(PORT, () => {
            console.log(`🚀 Servidor chatLlm corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Error al iniciar el servidor:', err);
    }
})();
