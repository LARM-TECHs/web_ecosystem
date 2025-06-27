// models/index.js
const sequelize = require('../config/db');

const User = require('./User');
const Menu = require('./menu');
const QRCode = require('./qrcode');
const Staff = require('./staff');
const Student = require('./student');

// Relaciones
Student.belongsTo(User, { foreignKey: 'user_id' });
Staff.belongsTo(User, { foreignKey: 'user_id' });
QRCode.belongsTo(Student, { foreignKey: 'student_id' });
Menu.hasMany(QRCode, { foreignKey: 'menu_id' });

module.exports = {
  sequelize,
  User,
  Menu,
  QRCode,
  Staff,
  Student
};
