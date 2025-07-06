import { Router } from 'express';
import {
    handleChatStream,
    getConversations,
    getConversationMessages
} from '../controllers/chat.controller.js';

const router = Router();

// --- RUTAS REESTRUCTURADAS ---

// La ruta principal para chatear. Siempre es un stream.
// El cuerpo de la petición puede incluir un 'conversationId' para continuar un chat existente.
router.post('/stream', handleChatStream);

// Ruta para obtener la lista de todas las conversaciones de un usuario.
router.get('/conversations', getConversations);

// Ruta para obtener todos los mensajes de una conversación específica.
router.get('/conversations/:conversationId', getConversationMessages);

export default router;
