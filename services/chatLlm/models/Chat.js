// Chat.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const Chat = sequelize.define('Chat', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
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
    // chat_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // }
}, {
    tableName: 'chats',
    schema: process.env.DB_SCHEMA || 'llm',
    timestamps: false
});

// Si necesitas definir asociaciones, hazlo fuera del define, típicamente en index.js o donde centralices modelos
Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });
};

export default Chat;
