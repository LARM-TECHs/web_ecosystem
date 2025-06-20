// api-gateway/config/services.js
export const services = {
    'authService': {
        target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
        routes: {
            // ORIGINAL: '/auth/register': { method: 'POST', authRequired: false },
            // CORRECTION: The API Gateway needs to forward to /api/auth/register on the user-auth-service
            '/auth/register': { method: 'POST', authRequired: false, targetPath: '/api/auth/register' }, // <--- ADD targetPath
            '/auth/login': { method: 'POST', authRequired: false, targetPath: '/api/auth/login' },     // <--- ADD targetPath
            '/auth/profile': { method: 'GET', authRequired: true, targetPath: '/api/auth/profile' }    // <--- ADD targetPath
        }
    },
    'chatLlmService': { // UPDATED SERVICE ENTRY
        target: process.env.CHAT_LLM_SERVICE_URL || 'http://localhost:4001',
        routes: {
            // Gateway path          --> Target path on chat-llm-service
            '/chat-llm/chat': { method: 'POST', authRequired: true, targetPath: '/api/chat-llm/chat' },
            '/chat-llm/chats': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/chats' },
            '/chat-llm/chats/:chat_id': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/chats/:chat_id' },
            '/chat-llm/protected': { method: 'GET', authRequired: true, targetPath: '/api/chat-llm/protected' }
        }
    }
    // Add more services as your ecosystem grows
};