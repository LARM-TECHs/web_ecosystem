// api-gateway/routes/index.js
import { Router } from 'express';
import axios from 'axios';
import { services } from '../config/services.js';
import { authenticateGateway } from '../middleware/authGateway.js';

const router = Router();

// Central routing logic
Object.keys(services).forEach(serviceName => {
    const service = services[serviceName];
    const serviceTarget = service.target;

    Object.keys(service.routes).forEach(routePath => {
        const routeConfig = service.routes[routePath];
        const method = routeConfig.method.toLowerCase(); // 'get', 'post', etc.

        // Construct the gateway-facing route (e.g., /auth/register, /chat-llm/chat)
        const gatewayRoute = routePath;

        router[method](gatewayRoute,
            // Apply authentication middleware if required for this route
            routeConfig.authRequired ? authenticateGateway : (req, res, next) => next(),
            async (req, res) => {
            try {
                let downstreamUrl;

                // --- MODIFIED LOGIC HERE ---
                if (routeConfig.targetPath) {
                    // Use the explicitly defined targetPath if it exists
                    downstreamUrl = `${serviceTarget}${routeConfig.targetPath}`;
                } else if (routeConfig.stripPrefix) {
                    // If stripPrefix is true, remove the service prefix from the URL
                    const prefix = `/${serviceName.replace('Service', '')}`; // e.g., /chat-llm
                    downstreamUrl = `${serviceTarget}${req.originalUrl.substring(prefix.length)}`;
                } else {
                    // Default behavior: forward the original URL path
                    downstreamUrl = `${serviceTarget}${req.originalUrl}`;
                }
                // --- END MODIFIED LOGIC ---


                console.log(`Proxying request: ${req.method} ${req.originalUrl} to ${downstreamUrl}`);

                // Forward the request to the target microservice
                const response = await axios({
                    method: req.method,
                    url: downstreamUrl,
                    data: req.body,        // Forward request body for POST/PUT
                    params: req.query,     // Forward query parameters
                    headers: {             // Forward relevant headers, including custom ones from authGateway
                        'Content-Type': req.headers['content-type'] || 'application/json',
                        'X-User-ID': req.headers['x-user-id'],
                        'X-User-Correo': req.headers['x-user-correo'],
                        'X-User-Rol': req.headers['x-user-rol']
                        // Add any other headers you want to forward consistently
                    }
                });

                res.status(response.status).json(response.data);
            } catch (error) {
                console.error(`Error proxying request to ${serviceName} for route ${gatewayRoute}:`, error.message);
                if (error.response) {
                    // Forward downstream service's error response (status and body)
                    res.status(error.response.status).json(error.response.data);
                } else {
                    res.status(500).json({ message: 'Error interno del gateway al procesar la solicitud.' });
                }
            }
        });
    });
});

export default router;