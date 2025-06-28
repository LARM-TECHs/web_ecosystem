// libreria-service/models/Libro.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize

const Libro = sequelize.define('Libro', {
    id_libro: { // Nombre de la PK consistente con otras tablas
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    classification: { // Ej. Ficción, Ciencia, Historia, etc.
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicationDate: { // Fecha de publicación del libro
        type: DataTypes.DATEONLY, // Solo la fecha sin hora
        allowNull: true, // Puede que no siempre se conozca
    },
    copies: { // Número total de copias disponibles
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    type: { // Ej. Físico, E-book, Audiolibro
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: { // Ubicación física en la librería (ej. estante, pasillo)
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'libros', // Nombre de la tabla en la base de datos
    timestamps: true, // createdAt, updatedAt
});

export default Libro;
