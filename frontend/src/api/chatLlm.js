// src/api/chatLlm.js
import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:4000'; // URL de tu API Gateway

/**
 * Obtiene el token JWT del localStorage.
 * @returns {string | null} El token JWT o null si no se encuentra.
 */
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Configuración de headers con token de autenticación.
 * Asegura que el prefijo "Bearer " se añada al token.
 * @returns {object} Objeto de headers.
 */
const getAuthHeaders = () => {
    const token = getAuthToken();
    // ** CORRECCIÓN: Añadir "Bearer " si el token existe **
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtiene la lista de chats de un usuario.
 * @returns {Promise<Array<object>>} Array de objetos de chat.
 * @throws {Error} Si la solicitud falla.
 */
export const getChatList = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/chat-llm/chats`, {
            headers: getAuthHeaders()
        });
        return response.data; // Esperamos un objeto como { chats: [...] }
    } catch (error) {
        console.error('Error fetching chat list from API:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo obtener la lista de chats.');
    }
};

/**
 * Obtiene el historial de mensajes para un chat específico.
 * @param {string} chatId - El ID del chat.
 * @returns {Promise<object>} Objeto con el historial del chat.
 * @throws {Error} Si la solicitud falla.
 */
export const getChatHistory = async (chatId) => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/chat-llm/chats/${chatId}`, {
            headers: getAuthHeaders()
        });
        return response.data; // Esperamos un objeto como { history: [...] }
    } catch (error) {
        console.error(`Error fetching chat history for chat ID ${chatId} from API:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `No se pudo obtener el historial del chat ${chatId}.`);
    }
};

/**
 * Envía un mensaje al LLM y recibe una respuesta.
 * @param {object} payload - Objeto que contiene el mensaje (ej. { message: "Hola" }).
 * @returns {Promise<object>} Objeto con la respuesta del LLM.
 * @throws {Error} Si la solicitud falla.
 */
export const sendMessage = async (payload) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/chat-llm/chat`, payload, { // El payload ya es { message: input }
            headers: getAuthHeaders()
        });
        // La estructura de la respuesta puede variar, ajusta según lo que devuelve tu LLM.
        // Asumiendo que `response.data` directamente contiene la respuesta del LLM como el botMessage
        console.log('Respuesta del LLM:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message to LLM API:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al enviar mensaje al Chat LLM.');
    }
};
