// notas-estudiantes-service/models/Asignatura.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Asignatura = sequelize.define('asignatura', {
    id_asignatura: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_asignatura: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    schema: process.env.DB_SCHEMA, // Ensure schema is set here
    tableName: 'asignatura',     // Explicitly set table name
    timestamps: false
});

export default Asignatura;