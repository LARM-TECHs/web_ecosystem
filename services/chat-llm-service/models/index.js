// services/chatLlm/models/index.js
import sequelize from '../config/db.js';
import Chat from './Chat.js';
import Trace from './Trace.js';
import Conversation from './Conversation.js';
import Message from './Message.js';


// --- Definición de Relaciones ---
// Una Conversación tiene muchos Mensajes.
Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
    as: 'messages', // Alias para acceder a los mensajes desde una conversación
    onDelete: 'CASCADE' // Si se elimina una conversación, se eliminan todos sus mensajes.
});

// Un Mensaje pertenece a una Conversación.
Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation' // Alias para acceder a la conversación desde un mensaje
});

// Exporta los modelos que pertenecen a este microservicio
export { Chat, Trace, Conversation, Message, sequelize };