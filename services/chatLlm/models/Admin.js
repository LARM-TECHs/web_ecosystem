import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Admin = sequelize.define('Admin', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
}, {
    tableName: 'admins',
    timestamps: false
});

export default Admin;
