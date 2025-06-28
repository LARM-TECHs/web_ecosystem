// libreria-service/models/Prestamo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize

const Prestamo = sequelize.define('Prestamo', {
    id_prestamo: { // Nombre de la PK consistente
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    // Foreign Key a Libro
    id_libro: { // Relación con el libro que se presta
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'libros', // Nombre de la tabla del modelo Libro
            key: 'id_libro',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // No borrar libro si tiene préstamos activos
    },
    // Foreign Key a Usuario (ID del usuario de user-auth-service)
    id_usuario: { // Quién ha tomado prestado el libro
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario que realizó el préstamo (del microservicio de autenticación)'
    },
    loanDate: { // Fecha de inicio del préstamo
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    returnDate: { // Fecha de devolución esperada
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    actualReturnDate: { // Fecha de devolución real
        type: DataTypes.DATEONLY,
        allowNull: true, // Nulo si el libro no ha sido devuelto
    },
    status: { // Estado del préstamo: 'prestado', 'devuelto', 'atrasado'
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'prestado',
        validate: {
            isIn: [['prestado', 'devuelto', 'atrasado']]
        }
    }
}, {
    tableName: 'prestamos', // Nombre de la tabla en la base de datos
    timestamps: true, // createdAt, updatedAt
});

export default Prestamo;
