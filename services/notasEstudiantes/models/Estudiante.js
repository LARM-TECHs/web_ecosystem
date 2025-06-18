import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Estudiante = sequelize.define('estudiante', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    contraseña: DataTypes.STRING
}, { timestamps: false });

export default Estudiante;
