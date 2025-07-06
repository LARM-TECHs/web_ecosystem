import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modelo para las conversaciones o hilos de chat.
 * Cada entrada representa una conversación completa de un usuario.
 */
const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario propietario de la conversación (del servicio de autenticación)'
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Título de la conversación, usualmente generado a partir del primer mensaje'
    }
}, {
    tableName: 'conversations',
    schema: process.env.DB_SCHEMA || 'llm',
    timestamps: true, // Habilita createdAt y updatedAt
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    comment: 'Almacena los hilos de conversación de los usuarios'
});

export default Conversation;
