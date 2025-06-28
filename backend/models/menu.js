// models/Menu.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Menu extends Model {}

Menu.init({
 menu_id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  breakfast: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lunch: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dinner: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Menu',
  tableName: 'menus',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Menu;
