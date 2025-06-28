// api-gateway/routes/index.js
import { Router } from 'express';
import axios from 'axios';
import { services } from '../config/services.js';
import { authenticateGateway } from '../middleware/authGateway.js';

const router = Router();

console.log('--- API Gateway: Iniciando Registro de Rutas (usando Array de Rutas) ---');

Object.keys(services).forEach(serviceName => {
    const service = services[serviceName];
    const serviceTarget = service.target;

    console.log(`\nProcesando servicio: "${serviceName}" (Target: ${serviceTarget})`);

    // CAMBIO CLAVE AQUÍ: Iterar sobre el array de rutas
    service.routes.forEach(routeConfig => {
        const method = routeConfig.method.toLowerCase(); // 'get', 'post', etc.
        const gatewayRoute = routeConfig.path; // La ruta que el API Gateway expone

        // Log para ver cada ruta que se está intentando registrar en el Gateway
        console.log(`  Registrando ruta Gateway: ${method.toUpperCase()} ${gatewayRoute} (Auth Requerida: ${routeConfig.authRequired ? 'Sí' : 'No'})`);

        // Registrar la ruta en el router de Express del Gateway
        router[method](gatewayRoute,
            // Aplicar el middleware de autenticación del Gateway si la ruta lo requiere
            routeConfig.authRequired ? authenticateGateway : (req, res, next) => next(),
            async (req, res) => {
                try {
                    let downstreamUrl;

                    if (routeConfig.targetPath) {
                        // Si se define un targetPath explícito, usarlo.
                        // Necesitamos reemplazar los parámetros de la URL para el targetPath.
                        downstreamUrl = `${serviceTarget}${routeConfig.targetPath}`;
                        // Reemplazar placeholders de ruta como ':id_libro' con valores de req.params
                        for (const param in req.params) {
                            downstreamUrl = downstreamUrl.replace(`:${param}`, req.params[param]);
                        }
                    } else if (routeConfig.stripPrefix) {
                        const prefix = `/${serviceName.replace('Service', '').toLowerCase()}`; // Asegura el prefijo en minúsculas
                        downstreamUrl = `${serviceTarget}${req.originalUrl.substring(prefix.length)}`;
                    } else {
                        // Por defecto, reenviar la URL original tal cual (después del prefijo del Gateway si existe)
                        downstreamUrl = `${serviceTarget}${req.originalUrl}`;
                    }

                    console.log(`    Proxying: ${req.method} ${req.originalUrl} --> ${downstreamUrl}`);
                    console.log(`    Headers que se envían al microservicio (revisar x-user-*):`, {
                        'Content-Type': req.headers['content-type'],
                        'X-User-ID': req.headers['x-user-id'],
                        'X-User-Correo': req.headers['x-user-correo'],
                        'X-User-Rol': req.headers['x-user-rol']
                    });

                    const response = await axios({
                        method: req.method,
                        url: downstreamUrl,
                        data: req.body,
                        params: req.query,
                        headers: {
                            'Content-Type': req.headers['content-type'] || 'application/json',
                            'X-User-ID': req.headers['x-user-id'],
                            'X-User-Correo': req.headers['x-user-correo'],
                            'X-User-Rol': req.headers['x-user-rol'],
                        },
                        // Esto evita que Axios lance un error para respuestas 4xx, lo que nos permite reenviar el error original
                        validateStatus: function (status) {
                            return status >= 200 && status < 500;
                        }
                    });

                    // Reenviar la respuesta del microservicio al cliente
                    res.status(response.status).json(response.data);

                } catch (error) {
                    // Manejo de errores durante el proxying
                    console.error(`ERROR al hacer proxy de ${req.method} ${gatewayRoute} al servicio ${serviceName}:`, error.message);
                    if (error.response) {
                        // Si hay una respuesta de error del microservicio, reenviarla
                        console.error('Detalles del error del microservicio:', error.response.status, error.response.data);
                        res.status(error.response.status).json(error.response.data);
                    } else {
                        // Si es un error de red o Axios no pudo enviar la solicitud
                        res.status(500).json({ message: 'Error interno del gateway al procesar la solicitud.', details: error.message });
                    }
                }
            });
    });
});

console.log('--- API Gateway: Registro de Rutas Completado ---');

export default router;
