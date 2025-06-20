// models/Trace.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Modelo para registrar trazas o logs de interacciones con el LLM,
 * que pueden ser más detalladas que el historial de chat directo.
 * Útil para depuración o análisis de uso.
 */
const Trace = sequelize.define('Trace', {
    // user_id se refiere al id del usuario del microservicio de autenticación
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario del servicio de autenticación'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenido del mensaje (input) para la traza'
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Respuesta o resultado de la operación para la traza'
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de la traza'
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true, // O false si siempre hay un tipo
        comment: 'Tipo de traza (ej. "chat_request", "error", "feedback")'
    }
}, {
    tableName: 'traces',
    schema: process.env.DB_SCHEMA || 'llm',
    timestamps: false, // No usar columnas 'createdAt' y 'updatedAt'
    comment: 'Registro detallado de trazas de interacciones con el LLM'
});

export default Trace;
