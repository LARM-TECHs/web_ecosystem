// models/QRCode.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class QRCode extends Model {}

QRCode.init({
  qr_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'menus',
      key: 'menu_id'
    }
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'QRCode',
  tableName: 'qr_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = QRCode;