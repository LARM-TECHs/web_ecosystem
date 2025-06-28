import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Staff extends Model { }

Staff.init({
    id: { // ID interno de la tabla de personal
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único interno del personal del comedor'
    },
    staff_id: { // Un identificador único para el personal (ej. código de empleado)
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Identificador único del personal'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre del miembro del personal'
    },
    role: { // Rol dentro del personal del comedor (ej. "chef", "administrador_comedor", "asistente")
        type: DataTypes.STRING(50),
        defaultValue: 'staff',
        comment: 'Rol del personal en el comedor'
    },
    user_id: { // ID del usuario del microservicio de autenticación (opcional si no todos son usuarios del sistema)
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID del usuario del microservicio de autenticación (user-auth-service)'
    }
}, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff_comedor',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Tabla para almacenar información del personal del comedor',
    indexes: [
        { unique: true, fields: ['staff_id'] },
        { unique: true, fields: ['user_id'] }
    ]
});

export default Staff;
