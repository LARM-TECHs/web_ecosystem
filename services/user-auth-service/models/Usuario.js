import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

/**
 * Define el modelo 'Usuario' para la tabla 'usuario' en la base de datos.
 * Este modelo representa la estructura de un usuario en el sistema.
 */
export const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario'
    },
    correo: {
        type: DataTypes.STRING,
        // Se ha quitado 'unique: true' de aquí y se ha movido a la sección 'indexes'
        allowNull: false, // El correo es un campo obligatorio
        validate: {
            isEmail: true // Valida que el formato sea de email
        },
        comment: 'Correo electrónico del usuario, utilizado para el login'
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false, // La contraseña es obligatoria
        comment: 'Contraseña encriptada del usuario'
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'estudiante', // Rol por defecto si no se especifica
        comment: 'Rol del usuario (ej. estudiante, profesor, administrador)'
    }
}, {
    tableName: 'usuario', // Nombre de la tabla en la base de datos
    timestamps: false, // Deshabilita las columnas createdAt y updatedAt
    schema: process.env.DB_SCHEMA || 'public', // Usa el esquema definido en .env o 'public' por defecto
    comment: 'Tabla para almacenar información de los usuarios del sistema',
    // Definición explícita del índice único para la columna 'correo'
    indexes: [
        {
            unique: true,
            fields: ['correo'],
            name: 'unique_correo_idx' // Nombre opcional para el índice
        }
    ]
});
