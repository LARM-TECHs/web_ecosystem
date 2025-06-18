// Role.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    permissions: {
        type: DataTypes.JSONB, // Puedes usar JSONB en Postgres
        allowNull: false
    }
}, {
    tableName: 'roles',
    timestamps: false
});

export default Role;
