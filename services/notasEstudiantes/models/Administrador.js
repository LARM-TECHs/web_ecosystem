import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Administrador = sequelize.define('administrador', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    correo: DataTypes.STRING,
    contraseña: DataTypes.STRING
}, { timestamps: false });

export default Administrador;
