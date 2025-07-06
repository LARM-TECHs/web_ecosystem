// src/api/chatLlm.js
import { fetchEventSource } from '@microsoft/fetch-event-source';
import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:4000'; // URL de tu API Gateway

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * [NUEVO] Obtiene la lista de conversaciones de un usuario.
 * @returns {Promise<Array<object>>} Array de objetos de conversación.
 */
export const getConversations = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/chat-llm/conversations`, {
            headers: getAuthHeaders()
        });
        return response.data.conversations; // Devuelve el array directamente
    } catch (error) {
        console.error('Error fetching conversations from API:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo obtener la lista de conversaciones.');
    }
};

/**
 * [NUEVO] Obtiene el historial de mensajes para una conversación específica.
 * @param {string} conversationId - El ID de la conversación.
 * @returns {Promise<Array<object>>} Array con los mensajes de la conversación.
 */
export const getConversationMessages = async (conversationId) => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/chat-llm/conversations/${conversationId}`, {
            headers: getAuthHeaders()
        });
        return response.data.messages; // Devuelve el array de mensajes
    } catch (error) {
        console.error(`Error fetching messages for conversation ${conversationId}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo obtener el historial del chat.');
    }
};

/**
 * [NUEVO Y MEJORADO] Inicia o continúa una conversación en modo STREAMING.
 * Usa la librería @microsoft/fetch-event-source que es más robusta.
 * @param {object} payload - Objeto que contiene el mensaje y opcionalmente el conversationId.
 * @param {object} callbacks - Objeto con los callbacks onMessage, onError, onClose, onOpen.
 * @returns {object} Un objeto con un método `abort()` para detener el stream.
 */
export const streamChat = (payload, { onOpen, onMessage, onError, onClose }) => {
    const token = getAuthToken();
    if (!token) {
        onError(new Error("Token de autenticación no encontrado."));
        return;
    }

    const ctrl = new AbortController();

    fetchEventSource(`${API_GATEWAY_URL}/chat-llm/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // fetchEventSource sí permite headers
        },
        body: JSON.stringify(payload),
        signal: ctrl.signal,

        onopen: async (response) => {
            if (response.ok) {
                onOpen(); // Llama al callback onOpen cuando la conexión se establece
            } else {
                const error = await response.json();
                throw new Error(error.message || `Error del servidor: ${response.statusText}`);
            }
        },
        onmessage(ev) {
            // Maneja los diferentes tipos de eventos que enviamos desde el backend
            if (ev.event === 'conversation_id') {
                const data = JSON.parse(ev.data);
                onMessage({ type: 'id', ...data });
            } else if (ev.data === '[DONE]') {
                // El evento de cierre ahora se maneja en el callback 'onclose'
            } else {
                const data = JSON.parse(ev.data);
                onMessage({ type: 'chunk', ...data });
            }
        },
        onclose() {
            onClose(); // Llama al callback onClose cuando la conexión se cierra limpiamente
        },
        onerror(err) {
            onError(err); // Llama al callback onError si ocurre un error
            throw err; // Es importante relanzar el error para detener el reintento automático
        }
    });

    return {
        abort: () => ctrl.abort()
    };
};

