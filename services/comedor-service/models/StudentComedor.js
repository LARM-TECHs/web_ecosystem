import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class StudentComedor extends Model { }

StudentComedor.init({
    id: { // ID interno de la tabla de estudiantes del comedor
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único interno del estudiante del comedor'
    },
    student_id: { // ID del estudiante del microservicio de notas-estudiantes
        type: DataTypes.STRING(50), // Usamos STRING si el ID es un UUID o un código
        allowNull: false,
        comment: 'Identificador del estudiante del microservicio de notas-estudiantes o sistema principal de estudiantes'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre del estudiante'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { isEmail: true },
        comment: 'Correo electrónico del estudiante (debe coincidir con user-auth-service)'
    },
    user_id: { // ID del usuario del microservicio de autenticación
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario del microservicio de autenticación (user-auth-service)'
    }
}, {
    sequelize,
    modelName: 'StudentComedor',
    tableName: 'students_comedor',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Tabla para almacenar registros de estudiantes en el contexto del comedor',
    indexes: [
        { unique: true, fields: ['student_id'] },
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['user_id'] }
    ]
});

export default StudentComedor;
