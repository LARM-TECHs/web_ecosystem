// notas-estudiantes-service/models/index.js
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize'; // Import DataTypes for use in associations if needed

// Import the revised models that belong to this service
import Asignatura from './Asignatura.js';
import Carrera from './Carrera.js';
import CarreraAsignatura from './CarreraAsignatura.js';
import EstudianteProfile from './EstudianteProfile.js'; // Changed from Estudiante
// REMOVED: import Administrador from './Administrador.js';
// REMOVED: import Usuario from './Usuario.js';
import Nota from './Nota.js';
import Facultad from './Facultad.js';
import Brigada from './Brigada.js';

// Define Associations within the notas-estudiantes-service's domain

// 1. Carrera and Asignatura (Many-to-Many through CarreraAsignatura)
Carrera.belongsToMany(Asignatura, {
    through: CarreraAsignatura,
    foreignKey: 'id_carrera',
    otherKey: 'id_asignatura',
    as: 'asignaturas' // Alias for eager loading
});
Asignatura.belongsToMany(Carrera, {
    through: CarreraAsignatura,
    foreignKey: 'id_asignatura',
    otherKey: 'id_carrera',
    as: 'carreras' // Alias for eager loading
});

// 2. Carrera and Brigada (One-to-Many)
Carrera.hasMany(Brigada, { foreignKey: 'id_carrera', as: 'brigadas' });
Brigada.belongsTo(Carrera, { foreignKey: 'id_carrera', as: 'carrera' });

// 3. EstudianteProfile and Brigada (One-to-Many - assuming an EstudianteProfile belongs to one Brigada)
// Note: id_brigada is on EstudianteProfile
Brigada.hasMany(EstudianteProfile, { foreignKey: 'id_brigada', as: 'estudiantes' });
EstudianteProfile.belongsTo(Brigada, { foreignKey: 'id_brigada', as: 'brigada' });


// 4. Nota and EstudianteProfile (One-to-Many)
EstudianteProfile.hasMany(Nota, { foreignKey: 'id_estudiante', as: 'notas' }); // id_estudiante on Nota maps to id_estudiante_profile on EstudianteProfile
Nota.belongsTo(EstudianteProfile, { foreignKey: 'id_estudiante', as: 'estudiante' });

// 5. Nota and Asignatura (One-to-Many)
Asignatura.hasMany(Nota, { foreignKey: 'id_asignatura', as: 'notas' });
Nota.belongsTo(Asignatura, { foreignKey: 'id_asignatura', as: 'asignatura' });

// 6. Facultad and Carrera (One-to-Many)
Facultad.hasMany(Carrera, { foreignKey: 'id_facultad', as: 'carreras' });
Carrera.belongsTo(Facultad, { foreignKey: 'id_facultad', as: 'facultad' });


// Export all models and the sequelize instance
export {
    sequelize,
    Asignatura,
    Carrera,
    CarreraAsignatura,
    EstudianteProfile, // Export the renamed model
    Nota,
    Facultad,
    Brigada,
    // REMOVED: Administrador
    // REMOVED: Usuario
};

/**
 * Función para sincronizar los modelos con la base de datos,
 * asegurando que se creen o actualicen dentro del esquema definido.
 * Esta función es la que se llama desde server.js para inicializar la DB.
 *
 * NOTA: La lógica de creación de esquema y setear search_path se gestiona en `config/db.js`.
 */
export async function syncAllModels() {
    console.log('Iniciando sincronización de modelos para notas-estudiantes...');
    await sequelize.sync({ alter: true }); // Use alter: true cautiously in production
    console.log(`✅ Modelos sincronizados en esquema "${process.env.DB_SCHEMA || 'notas'}"`);
}