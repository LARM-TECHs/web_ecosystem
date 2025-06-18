import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Carrera = sequelize.define('carrera', {
    id_carrera: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_carrera: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

export default Carrera;
