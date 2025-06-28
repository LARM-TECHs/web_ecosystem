// votacion-service/models/Votacion.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize desde db.js

const Votacion = sequelize.define('Votacion', {
    id_votacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT, // Cambiado a TEXT para descripciones más largas
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'abierta', // 'abierta', 'cerrada', 'archivada'
        allowNull: false,
    },
}, {
    tableName: 'votaciones', // Nombre de la tabla en la base de datos
    timestamps: true, // Habilita createdAt y updatedAt
});

export default Votacion;
