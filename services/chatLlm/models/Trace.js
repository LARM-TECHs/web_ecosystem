import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Trace = sequelize.define('Trace', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'traces',
    timestamps: false,
    // schema: 'llm'  👈 opcional
});

export default Trace;
