// votacion-service/models/RegistroVotoUsuario.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize desde db.js

const RegistroVotoUsuario = sequelize.define('RegistroVotoUsuario', {
    id_registro_voto_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    // ID del usuario que votó, proveniente del user-auth-service
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // ID de la votación en la que el usuario votó
    id_votacion: {
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
    tableName: 'registro_votos_usuario', // Nombre de la tabla en la base de datos
    timestamps: true,
    // Asegura que un usuario solo pueda tener un registro (haber votado una vez) por votación
    indexes: [{
        unique: true,
        fields: ['id_usuario', 'id_votacion']
    }],
});

export default RegistroVotoUsuario;
