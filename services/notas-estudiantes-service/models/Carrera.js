// notas-estudiantes-service/models/Carrera.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Carrera = sequelize.define('carrera', {
    id_carrera: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_carrera: { type: DataTypes.STRING, allowNull: false }
}, {
    schema: process.env.DB_SCHEMA, // Ensure schema is set here
    tableName: 'carrera',        // Explicitly set table name
    timestamps: false
});

export default Carrera;