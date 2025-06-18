import sequelize from '../config/db.js';

import Asignatura from './Asignatura.js';
import Carrera from './Carrera.js';
import CarreraAsignatura from './CarreraAsignatura.js';
import Estudiante from './Estudiante.js';
import Administrador from './Administrador.js';
import Usuario from './Usuario.js';
import Nota from './Nota.js';
import Facultad from './Facultad.js';
import Brigada from './Brigada.js';

// Relaciones existentes
Carrera.belongsToMany(Asignatura, {
    through: CarreraAsignatura,
    foreignKey: 'id_carrera',
    otherKey: 'id_asignatura',
});
Asignatura.belongsToMany(Carrera, {
    through: CarreraAsignatura,
    foreignKey: 'id_asignatura',
    otherKey: 'id_carrera',
});

// Relaciones adicionales
Carrera.hasMany(Brigada, { foreignKey: 'id_carrera' });
Brigada.belongsTo(Carrera, { foreignKey: 'id_carrera' });

Estudiante.hasMany(Nota, { foreignKey: 'id_estudiante' });
Asignatura.hasMany(Nota, { foreignKey: 'id_asignatura' });
Nota.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });
Nota.belongsTo(Asignatura, { foreignKey: 'id_asignatura' });

// Exportar modelos y sequelize
export {
    sequelize,
    Asignatura,
    Carrera,
    CarreraAsignatura,
    Estudiante,
    Administrador,
    Usuario,
    Nota,
    Facultad,
    Brigada,
};
