// models/Chat.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Modelo para almacenar el historial de interacciones de chat con el LLM.
 * Cada entrada representa una pregunta del usuario y la respuesta del LLM.
 */
const Chat = sequelize.define('Chat', {
    // user_id aquí se refiere al id del usuario del microservicio de autenticación.
    // No se define una clave foránea a nivel de base de datos aquí, ya que el
    // modelo 'User' no es gestionado por este microservicio.
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario del servicio de autenticación'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenido del mensaje del usuario'
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Respuesta generada por el LLM'
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de la interacción'
    }
}, {
    tableName: 'chats',
    // Sequelize utilizará el esquema definido en la instancia global de sequelize
    // pero puedes sobrescribirlo aquí si necesitas un esquema diferente para un modelo específico.
    schema: process.env.DB_SCHEMA || 'llm',
    timestamps: false, // No usar columnas 'createdAt' y 'updatedAt'
    comment: 'Historial de conversaciones con el LLM por usuario'
});

export default Chat;
