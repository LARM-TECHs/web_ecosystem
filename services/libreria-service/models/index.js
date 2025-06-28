// libreria-service/models/index.js
import sequelize from '../config/db.js';
import Libro from './Libro.js';
import Prestamo from './Prestamo.js';
import Seleccion from './Seleccion.js';

// Definir asociaciones
// Un libro puede tener muchos préstamos
Libro.hasMany(Prestamo, { foreignKey: 'id_libro', as: 'prestamos' });
Prestamo.belongsTo(Libro, { foreignKey: 'id_libro', as: 'libro' });

// Un libro puede tener muchas selecciones (si la selección se refiere a un libro específico ya registrado)
// Comentado si 'Seleccion' es más para "sugerencias" o "intereses" que no son estrictamente del catálogo 'Libro'
// Libro.hasMany(Seleccion, { foreignKey: 'id_libro', as: 'selecciones' });
// Seleccion.belongsTo(Libro, { foreignKey: 'id_libro', as: 'libro' });


const db = {
    sequelize,
    Libro,
    Prestamo,
    Seleccion,
};

export default db; // Exporta todos los modelos y la instancia de sequelize
