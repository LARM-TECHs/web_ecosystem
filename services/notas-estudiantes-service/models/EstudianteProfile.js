// notas-estudiantes-service/models/EstudianteProfile.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Este modelo representa el perfil académico de un estudiante dentro de este servicio.
// No almacena credenciales de autenticación.
// El 'id_usuario' es la clave externa lógica al 'id' del Usuario del user-auth-service.
const EstudianteProfile = sequelize.define('estudiante_profile', { // Renamed table for clarity
    id_estudiante_profile: { // Added a primary key specific to this service
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // id_usuario es el ID del usuario del user-auth-service.
    // No hay una FK física aquí, ya que los servicios son independientes.
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // Un usuario solo debe tener un perfil de estudiante aquí
    },
    // Puedes guardar datos denormalizados aquí para evitar llamadas constantes al user-auth-service
    // Por ejemplo, el nombre, pero no el correo ni la contraseña.
    nombre_completo: { // Changed from 'nombre' for clarity
        type: DataTypes.STRING,
        allowNull: false
    },
    // Puedes añadir otros campos académicos específicos del estudiante aquí
    // ej: numero_matricula, fecha_ingreso, etc.
    numero_matricula: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Puede ser nulo si se asigna después
    },
    // Relación lógica con Brigada
    id_brigada: {
        type: DataTypes.INTEGER,
        allowNull: true // Puede ser nulo si el estudiante no está en una brigada aún
    }
}, {
    schema: process.env.DB_SCHEMA, // Asegura que la tabla se cree en el esquema correcto
    tableName: 'estudiante_profile', // Asegura el nombre de la tabla
    timestamps: false // Si no usas createdAt/updatedAt
});

export default EstudianteProfile;