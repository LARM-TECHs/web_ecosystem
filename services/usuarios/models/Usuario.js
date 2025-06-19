import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'estudiante'
    }
}, {
    tableName: 'usuario',
    timestamps: false,
    schema: process.env.DB_SCHEMA // <- Aquí se usa el schema 'usuarios'
});
