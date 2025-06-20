// notas-estudiantes-service/models/CarreraAsignatura.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CarreraAsignatura = sequelize.define('carrera_asignatura', {
    id_carrera: { type: DataTypes.INTEGER, primaryKey: true },
    id_asignatura: { type: DataTypes.INTEGER, primaryKey: true }
},
{
    schema: process.env.DB_SCHEMA, // Ensure schema is set here
    tableName: 'carrera_asignatura', // Explicitly set table name
    timestamps: false
});

export default CarreraAsignatura;