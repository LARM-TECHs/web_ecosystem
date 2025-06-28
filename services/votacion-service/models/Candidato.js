// votacion-service/models/Candidato.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize desde db.js

const Candidato = sequelize.define('Candidato', {
    id_candidato: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    carrera: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    anio: {
        type: DataTypes.STRING, // Podría ser INTEGER si es un año numérico
        allowNull: false,
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    foto_url: {
        type: DataTypes.STRING,
        allowNull: true, // URL de la imagen del candidato
    },
    // Foreign Key a Votacion (Election)
    id_votacion: { // Renombrado de electionId a id_votacion para consistencia
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'votaciones', // Nombre de la tabla de Votacion
            key: 'id_votacion', // Clave primaria en la tabla de Votacion
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'candidatos', // Nombre de la tabla en la base de datos
    timestamps: true,
});

export default Candidato;
