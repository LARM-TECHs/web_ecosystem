// chat-llm-service/controllers/chat.controller.js
import { chatWithLlm } from '../utils/llm.js';
import { Chat, Trace } from '../models/index.js'; // Importa los modelos

/**
 * Controlador para manejar la interacción de chat con el LLM.
 * Recibe un mensaje del usuario, lo procesa con el LLM, guarda la interacción
 * en la base de datos y envía la respuesta al cliente.
 *
 * @param {object} req - Objeto de solicitud de Express (espera req.headers['x-user-id'] del API Gateway).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const handleChatRequest = async (req, res) => {
    const { message } = req.body;
    // req.headers['x-user-id'] viene del payload del JWT procesado por el API Gateway
    const userId = req.headers['x-user-id']; // Acceder al ID de usuario enviado por el Gateway
    const userCorreo = req.headers['x-user-correo']; // Opcional, si lo necesitas para logs, etc.

    if (!userId) {
        // Esto indica que la solicitud no fue autenticada por el Gateway
        console.warn('handleChatRequest: Solicitud recibida sin X-User-ID. Posible bypass de Gateway o error de autenticación.');
        return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
    }

    if (!message) {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    try {
        // Interactuar con el LLM
        const aiResponse = await chatWithLlm(message);

        // Guardar la interacción en el historial de chat
        const chatEntry = await Chat.create({
            user_id: userId,
            content: message,
            response: aiResponse,
            timestamp: new Date(),
        });

        // Opcional: Guardar una traza más detallada si es necesario para depuración/análisis
        await Trace.create({
            user_id: userId,
            content: message,
            response: aiResponse,
            timestamp: new Date(),
            type: 'chat_request'
        });

        res.json({
            // Formato de respuesta compatible con APIs de chat comunes (ej. OpenAI)
            choices: [{ message: { role: 'assistant', content: aiResponse } }],
            chat_id: chatEntry.id, // ID de la entrada de chat en la base de datos
        });
    } catch (err) {
        console.error(`❌ Error en handleChatRequest: ${err.message}`);
        res.status(500).json({ error: `Error al generar la respuesta o guardar el chat: ${err.message}` });
    }
};

/**
 * Controlador para listar los chats recientes de un usuario.
 * @param {object} req - Objeto de solicitud de Express (espera req.headers['x-user-id'] del API Gateway).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getRecentChats = async (req, res) => {
    const userId = req.headers['x-user-id']; // Acceder al ID de usuario enviado por el Gateway

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
    }

    try {
        const chats = await Chat.findAll({
            attributes: ['id', 'content', 'timestamp'], // Puedes ajustar los atributos que quieres devolver
            where: { user_id: userId },
            order: [['timestamp', 'DESC']],
            limit: 20, // Limita a los últimos 20 chats
        });

        res.json({ chats });
    } catch (err) {
        console.error(`❌ Error en getRecentChats: ${err.message}`);
        res.status(500).json({ error: `Error al recuperar chats: ${err.message}` });
    }
};

/**
 * Controlador para obtener el detalle de un chat específico.
 * @param {object} req - Objeto de solicitud de Express (espera req.headers['x-user-id'] del API Gateway).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getChatDetail = async (req, res) => {
    const { chat_id } = req.params;
    const userId = req.headers['x-user-id']; // Acceder al ID de usuario enviado por el Gateway

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
    }

    try {
        const chat = await Chat.findOne({
            where: { id: chat_id, user_id: userId } // Asegura que solo el propietario pueda ver su chat
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat no encontrado o no pertenece al usuario.' });
        }

        res.json({
            id: chat.id,
            message: chat.content,
            response: chat.response,
            timestamp: chat.timestamp
        });
    } catch (err) {
        console.error(`❌ Error en getChatDetail: ${err.message}`);
        res.status(500).json({ error: `Error al recuperar el chat: ${err.message}` });
    }
};

/**
 * Controlador para una ruta de prueba protegida.
 * Demuestra que la autenticación está funcionando y los datos del usuario se propagan.
 * @param {object} req - Objeto de solicitud de Express (espera req.headers con datos del usuario del API Gateway).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getProtectedTest = (req, res) => {
    // req.headers['x-user-correo'] y otros vienen del payload del JWT procesado por el API Gateway
    const userId = req.headers['x-user-id'];
    const userCorreo = req.headers['x-user-correo'];
    const userRol = req.headers['x-user-rol'];

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
    }

    res.json({
        message: `Hola, ${userCorreo}. Estás viendo una ruta protegida en el servicio de chat.`,
        user: {
            id: userId,
            correo: userCorreo,
            rol: userRol
        }
    });
};

// // controllers/chat.controller.js
// import { chatWithLlm } from '../utils/llm.js';
// import { Chat, Trace } from '../models/index.js'; // Importa los modelos

// /**
//  * Controlador para manejar la interacción de chat con el LLM.
//  * Recibe un mensaje del usuario, lo procesa con el LLM, guarda la interacción
//  * en la base de datos y envía la respuesta al cliente.
//  *
//  * @param {object} req - Objeto de solicitud de Express (con req.user del middleware de auth).
//  * @param {object} res - Objeto de respuesta de Express.
//  */
// export const handleChatRequest = async (req, res) => {
//     const { message } = req.body;
//     // req.user.id viene del payload del JWT del user-auth-service
//     const userId = req.user.id;

//     if (!message) {
//         return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
//     }

//     try {
//         // Interactuar con el LLM
//         const aiResponse = await chatWithLlm(message);

//         // Guardar la interacción en el historial de chat
//         const chatEntry = await Chat.create({
//             user_id: userId,
//             content: message,
//             response: aiResponse,
//             timestamp: new Date(),
//         });

//         // Opcional: Guardar una traza más detallada si es necesario para depuración/análisis
//         await Trace.create({
//             user_id: userId,
//             content: message,
//             response: aiResponse,
//             timestamp: new Date(),
//             type: 'chat_request'
//         });

//         res.json({
//             // Formato de respuesta compatible con APIs de chat comunes (ej. OpenAI)
//             choices: [{ message: { role: 'assistant', content: aiResponse } }],
//             chat_id: chatEntry.id, // ID de la entrada de chat en la base de datos
//         });
//     } catch (err) {
//         console.error(`❌ Error en handleChatRequest: ${err.message}`);
//         res.status(500).json({ error: `Error al generar la respuesta o guardar el chat: ${err.message}` });
//     }
// };

// /**
//  * Controlador para listar los chats recientes de un usuario.
//  * @param {object} req - Objeto de solicitud de Express (con req.user del middleware de auth).
//  * @param {object} res - Objeto de respuesta de Express.
//  */
// export const getRecentChats = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const chats = await Chat.findAll({
//             attributes: ['id', 'content', 'timestamp'], // Puedes ajustar los atributos que quieres devolver
//             where: { user_id: userId },
//             order: [['timestamp', 'DESC']],
//             limit: 20, // Limita a los últimos 20 chats
//         });

//         res.json({ chats });
//     } catch (err) {
//         console.error(`❌ Error en getRecentChats: ${err.message}`);
//         res.status(500).json({ error: `Error al recuperar chats: ${err.message}` });
//     }
// };

// /**
//  * Controlador para obtener el detalle de un chat específico.
//  * @param {object} req - Objeto de solicitud de Express (con req.user del middleware de auth).
//  * @param {object} res - Objeto de respuesta de Express.
//  */
// export const getChatDetail = async (req, res) => {
//     const { chat_id } = req.params;
//     const userId = req.user.id;

//     try {
//         const chat = await Chat.findOne({
//             where: { id: chat_id, user_id: userId } // Asegura que solo el propietario pueda ver su chat
//         });

//         if (!chat) {
//             return res.status(404).json({ error: 'Chat no encontrado o no pertenece al usuario.' });
//         }

//         res.json({
//             id: chat.id,
//             message: chat.content,
//             response: chat.response,
//             timestamp: chat.timestamp
//         });
//     } catch (err) {
//         console.error(`❌ Error en getChatDetail: ${err.message}`);
//         res.status(500).json({ error: `Error al recuperar el chat: ${err.message}` });
//     }
// };

// /**
//  * Controlador para una ruta de prueba protegida.
//  * Demuestra que la autenticación está funcionando.
//  * @param {object} req - Objeto de solicitud de Express (con req.user del middleware de auth).
//  * @param {object} res - Objeto de respuesta de Express.
//  */
// export const getProtectedTest = (req, res) => {
//     // req.user.email viene del payload del JWT del user-auth-service
//     res.json({ message: `Hola, ${req.user.email}. Estás viendo una ruta protegida en el servicio de chat.`, user: req.user });
// };
