const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'chats',
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false
});

Chat.associate = (models) => {
  Chat.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });
};

module.exports = Chat;