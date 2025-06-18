import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Facultad = sequelize.define('facultad', {
    id_facultad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_facultad: { type: DataTypes.STRING, unique: true, allowNull: false },
}, {
    schema: process.env.DB_SCHEMA,
    tableName: 'facultad',
    timestamps: false,
});

export default Facultad;
