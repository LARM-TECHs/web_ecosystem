// models/index.js
const sequelize = require('../config/db');

const User = require('./User');
const Menu = require('./menu');
const QRCode = require('./qrcode');
const Staff = require('./staff');
const Student = require('./student');

// Relaciones corregidas
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Student, { foreignKey: 'user_id', as: 'student' });

Staff.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Staff, { foreignKey: 'user_id', as: 'staff' });

QRCode.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(QRCode, { foreignKey: 'student_id', as: 'qrCodes' });

QRCode.belongsTo(Menu, { foreignKey: 'menu_id', as: 'menu' });
Menu.hasMany(QRCode, { foreignKey: 'menu_id', as: 'qrCodes' });

module.exports = {
  sequelize,
  User,
  Menu,
  QRCode,
  Staff,
  Student
};