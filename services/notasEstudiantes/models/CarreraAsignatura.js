import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CarreraAsignatura = sequelize.define('carrera_asignatura', {
    id_carrera: { type: DataTypes.INTEGER, primaryKey: true },
    id_asignatura: { type: DataTypes.INTEGER, primaryKey: true }
},
    {
        timestamps: false
    });

export default CarreraAsignatura;
