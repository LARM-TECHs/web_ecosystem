// libreria-service/models/Seleccion.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize

const Seleccion = sequelize.define('Seleccion', {
    id_seleccion: { // Nombre de la PK consistente
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    // Foreign Key a Libro
    id_libro: { // El libro que ha sido "seleccionado"
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'libros', // Nombre de la tabla del modelo Libro
            key: 'id_libro',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    // Podrías añadir id_usuario aquí si la selección es personal (ej. lista de deseos, reserva)
    // id_usuario: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     comment: 'ID del usuario que realizó la selección'
    // },
    quantity: { // Cantidad de copias de ese libro seleccionadas/reservadas
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    // author y publisher son redundantes si ya tienes id_libro y puedes obtenerlos de Libro.
    // Los mantengo si tu intención es desnormalizar aquí o si es un registro de "interés" antes de que el libro sea un Libro formal.
    // Si ya es un 'Libro' existente, estas dos columnas no deberían ir aquí.
    // Voy a mantenerlos tal cual tu ejemplo, asumiendo que es una "selección" de algo que no necesariamente es un Libro ya registrado.
    book: { // Título del libro (desnormalizado, o para libros no registrados)
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: { // Autor del libro (desnormalizado, o para libros no registrados)
        type: DataTypes.STRING,
        allowNull: true,
    },
    publisher: { // Editorial (nuevo campo, no estaba en Libro)
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'selecciones', // Nombre de la tabla en la base de datos
    timestamps: true,
});

export default Seleccion;
