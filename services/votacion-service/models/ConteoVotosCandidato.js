// votacion-service/models/ConteoVotosCandidato.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize desde db.js

const ConteoVotosCandidato = sequelize.define('ConteoVotosCandidato', {
    id_conteo_voto_candidato: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    presidentVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    memberVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    // Foreign Key a Candidato
    id_candidato: { // Renombrado de candidateId a id_candidato
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'candidatos', // Nombre de la tabla de Candidato
            key: 'id_candidato',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    // Foreign Key a Votacion
    id_votacion: { // Renombrado de electionId a id_votacion
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'votaciones', // Nombre de la tabla de Votacion
            key: 'id_votacion',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'conteo_votos_candidatos', // Nombre de la tabla en la base de datos
    timestamps: true,
    // Asegura que solo haya un conteo de votos por candidato por votación
    indexes: [{
        unique: true,
        fields: ['id_candidato', 'id_votacion']
    }],
});

export default ConteoVotosCandidato;
