import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Nota = sequelize.define('nota', {
    id_nota: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
    id_asignatura: { type: DataTypes.INTEGER, allowNull: false },
    valor: { type: DataTypes.DECIMAL, allowNull: false },
    año: { type: DataTypes.INTEGER, allowNull: false },
}, {
    schema: process.env.DB_SCHEMA,
    tableName: 'nota',
    timestamps: false,
});

export default Nota;
