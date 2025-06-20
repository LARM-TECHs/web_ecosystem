// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import morgan from 'morgan'; // Uncomment if you want to use logging middleware
import mainRouter from './routes/index.js'; // Changed to mainRouter and points to './routes/index.js'
import { sequelize, syncAllModels } from './models/index.js'; // Import syncAllModels

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Define PORT here for cleaner use

// Middlewares
app.use(cors());
// app.use(morgan('dev')); // Uncomment if you want to use morgan
app.use(express.json()); // For parsing application/json

// --- Routes ---
// Apply a base path for your API routes for versioning and organization
app.use('/api/v1', mainRouter); // All your routes will now be prefixed with /api/v1

// --- Error Handling Middlewares ---

// Middleware 404 - Handle requests that don't match any route
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global para manejo de errores
// This should be the last middleware defined
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Error interno del servidor', message: err.message }); // Send a generic message but include error.message
});

// --- Database Synchronization and Server Start ---

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Conectado a la base de datos');

        // Use the syncAllModels function from models/index.js
        // { force: true } should only be used in development as it drops existing tables
        await syncAllModels();
        console.log('✅ Modelos sincronizados con la base de datos');

        app.listen(PORT, () => {
            console.log(`🚀 Servicio Notas ejecutándose en el puerto ${PORT}`);
            // Optional: Log which database and host you are connected to
            console.log(`Using database: ${sequelize.getDatabaseName()} on host ${sequelize.options.host} with user ${sequelize.options.username}`);
        });
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos o iniciar el servidor:', err);
        process.exit(1); // Exit the process with a failure code
    }
};

startServer();