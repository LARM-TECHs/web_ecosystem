// chat-llm-service/routes/chat.routes.js
import { Router } from 'express';
// Ya NO se importa authenticateToken desde el middleware local

import {
    handleChatRequest,
    getRecentChats,
    getChatDetail,
    getProtectedTest
} from '../controllers/chat.controller.js';

const router = Router();

// Todas las rutas de este microservicio ahora ASUMEN que el API Gateway ya realizó la autenticación
// y ha inyectado los headers de usuario (X-User-ID, X-User-Correo, X-User-Rol).

/**
 * Ruta para interactuar con el LLM y obtener una respuesta.
 * Guarda la interacción en el historial.
 * Método: POST
 * Endpoint: /chat
 * Requiere autenticación (manejada por el API Gateway).
 */
router.post('/chat', handleChatRequest); // Eliminado authenticateToken

/**
 * Ruta para listar los últimos chats de un usuario autenticado.
 * Método: GET
 * Endpoint: /chats
 * Requiere autenticación (manejada por el API Gateway).
 */
router.get('/chats', getRecentChats); // Eliminado authenticateToken

/**
 * Ruta para obtener los detalles de un chat específico por su ID.
 * Asegura que el chat pertenezca al usuario autenticado.
 * Método: GET
 * Endpoint: /chats/:chat_id
 * Requiere autenticación (manejada por el API Gateway).
 */
router.get('/chats/:chat_id', getChatDetail); // Eliminado authenticateToken

/**
 * Ruta de prueba protegida para verificar que la autenticación funciona.
 * Método: GET
 * Endpoint: /protected
 * Requiere autenticación (manejada por el API Gateway).
 */
router.get('/protected', getProtectedTest); // Eliminado authenticateToken

export default router;
