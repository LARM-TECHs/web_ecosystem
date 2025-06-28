// comedor-service/models/Menu.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Importa la instancia de Sequelize (ahora ES module)

class Menu extends Model {}

Menu.init({
    menu_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del menú'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha a la que corresponde el menú'
    },
    breakfast: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del desayuno'
    },
    lunch: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del almuerzo'
    },
    dinner: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción de la cena'
    }
}, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Tabla para almacenar los menús diarios del comedor',
    indexes: [
        {
            unique: true,
            fields: ['date']
        }
    ]
});

export default Menu;
