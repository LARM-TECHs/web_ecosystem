import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo para los mensajes individuales dentro de una conversación.
 */
const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'conversations', // Nombre de la tabla a la que hace referencia
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'assistant'),
        allowNull: false,
        // comment: 'Indica si el mensaje fue enviado por el usuario o por el asistente de IA'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'El contenido textual del mensaje'
    }
}, {
    tableName: 'messages',
    schema: process.env.DB_SCHEMA || 'llm',
    timestamps: true,
    updatedAt: false, // No necesitamos la columna updatedAt para los mensajes
    createdAt: 'timestamp', // Renombramos createdAt a timestamp
    comment: 'Almacena los mensajes individuales de cada conversación'
});

export default Message;
