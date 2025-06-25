// models/Student.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Student extends Model {}

Student.init({
  student_id: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  }
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Student;