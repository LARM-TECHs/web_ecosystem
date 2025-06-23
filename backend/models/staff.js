// models/Staff.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Staff extends sequelize.Model {}

Staff.init({
  staff_id: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'staff'
  }
}, {
  sequelize,
  modelName: 'Staff',
  tableName: 'staff',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Staff;