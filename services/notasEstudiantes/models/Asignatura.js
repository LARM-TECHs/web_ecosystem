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
    timestamps: false
});

export default Asignatura;
