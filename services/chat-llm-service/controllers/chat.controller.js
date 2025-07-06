import { Conversation, Message } from '../models/index.js';
import { chatWithHistoryStream } from '../utils/llm.js';

/**
 * Controlador principal para el streaming de chat.
 * - Crea una nueva conversación si no se proporciona un ID.
 * - Guarda el mensaje del usuario.
 * - Obtiene el historial completo de la conversación.
 * - Hace stream de la respuesta del LLM.
 * - Guarda la respuesta completa del LLM al finalizar.
 */
export const handleChatStream = async (req, res) => {
    let { message, conversationId } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) return res.status(401).json({ error: 'No autorizado.' });
    if (!message) return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });

    try {
        let conversation;
        // Si no hay ID de conversación, es un chat nuevo.
        if (!conversationId) {
            conversation = await Conversation.create({
                user_id: userId,
                title: message.substring(0, 50) // Usa los primeros 50 caracteres como título
            });
            conversationId = conversation.id;
        } else {
            // Verifica que la conversación existente pertenezca al usuario
            conversation = await Conversation.findOne({ where: { id: conversationId, user_id: userId } });
            if (!conversation) {
                return res.status(404).json({ error: 'Conversación no encontrada o no pertenece al usuario.' });
            }
        }

        // Guardar el mensaje del usuario en la base de datos
        await Message.create({
            conversation_id: conversationId,
            role: 'user',
            content: message
        });

        // Obtener todo el historial de la conversación para darle contexto al LLM
        const history = await Message.findAll({
            where: { conversation_id: conversationId },
            order: [['timestamp', 'ASC']],
            attributes: ['role', 'content']
        });

        // Configurar cabeceras para Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Enviar el ID de la conversación al cliente (muy útil si es un chat nuevo)
        res.write(`event: conversation_id\ndata: ${JSON.stringify({ conversationId })}\n\n`);

        const stream = await chatWithHistoryStream(history.map(h => h.toJSON()), message);

        let fullResponse = '';
        for await (const chunk of stream) {
            const content = chunk.content;
            if (content) {
                fullResponse += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        // Al finalizar el stream, guardar la respuesta completa del asistente
        if (fullResponse) {
            await Message.create({
                conversation_id: conversationId,
                role: 'assistant',
                content: fullResponse
            });
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (err) {
        console.error(`❌ Error en handleChatStream: ${err.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al procesar el stream.' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Error en el stream.' })}\n\n`);
            res.end();
        }
    }
};

/**
 * Obtiene la lista de todas las conversaciones de un usuario.
 */
export const getConversations = async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'No autorizado.' });

    try {
        const conversations = await Conversation.findAll({
            where: { user_id: userId },
            order: [['updated_at', 'DESC']],
            attributes: ['id', 'title', 'updated_at']
        });
        res.json({ conversations });
    } catch (err) {
        console.error(`❌ Error en getConversations: ${err.message}`);
        res.status(500).json({ error: 'Error al recuperar las conversaciones.' });
    }
};

/**
 * Obtiene todos los mensajes de una conversación específica.
 */
export const getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'No autorizado.' });

    try {
        // Primero, verificar que la conversación pertenece al usuario que la solicita
        const conversation = await Conversation.findOne({ where: { id: conversationId, user_id: userId } });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversación no encontrada o no pertenece al usuario.' });
        }

        // Si pertenece, obtener todos sus mensajes
        const messages = await Message.findAll({
            where: { conversation_id: conversationId },
            order: [['timestamp', 'ASC']],
            attributes: ['role', 'content', 'timestamp']
        });

        res.json({ messages });
    } catch (err) {
        console.error(`❌ Error en getConversationMessages: ${err.message}`);
        res.status(500).json({ error: 'Error al recuperar los mensajes.' });
    }
};
