import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Brigada = sequelize.define('brigada', {
    id_brigada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_carrera: { type: DataTypes.INTEGER, allowNull: false },
    nombre_brigada: DataTypes.STRING,
    año_brigada: DataTypes.INTEGER,
    añofinal_brigada: DataTypes.INTEGER,
}, {
    schema: process.env.DB_SCHEMA,
    tableName: 'brigada',
    timestamps: false,
});

export default Brigada;
