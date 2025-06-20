// api-gateway/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import gatewayRoutes from './routes/index.js'; // Import the consolidated routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // API Gateway will run on port 4000

// Enable CORS for all origins (adjust for production to be more restrictive)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies if needed

// Mount the gateway routes
app.use('/', gatewayRoutes);

// Basic health check route for the gateway itself
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is up and running!' });
});

// Global error handler (optional, but good practice)
app.use((err, req, res, next) => {
    console.error('Unhandled Gateway Error:', err);
    res.status(500).json({ message: 'Unhandled error in API Gateway.' });
});

// Start the gateway server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway corriendo en http://localhost:${PORT}`);
    console.log('🔗 Rutas configuradas para los microservicios.');
});