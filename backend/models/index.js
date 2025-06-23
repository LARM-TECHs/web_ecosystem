// models/index.js - Para definir las relaciones
const sequelize = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const Menu = require('./Menu');
const QRCode = require('./QRCode');
const Staff = require('./Staff');

// Definir relaciones
Student.hasMany(QRCode, { 
  foreignKey: 'student_id', 
  sourceKey: 'student_id' 
});

QRCode.belongsTo(Student, { 
  foreignKey: 'student_id', 
  targetKey: 'student_id' 
});

module.exports = {
  sequelize,
  User,
  Student,
  Menu,
  QRCode,
  Staff
};