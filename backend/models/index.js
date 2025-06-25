const sequelize = require('../config/db');

// Importar modelos
const User = require('./User');
const Menu = require('./menu');
const QRCode = require('./qrcode');
const Staff = require('./staff');
const Student = require('./student');

// Asociaciones (si existen relaciones entre modelos, defínelas aquí)
Student.belongsTo(User, { foreignKey: 'user_id' });
Staff.belongsTo(User, { foreignKey: 'user_id' });
QRCode.belongsTo(Student, { foreignKey: 'student_id' });
Menu.hasMany(QRCode, { foreignKey: 'menu_id' });

// Función para conectar y sincronizar la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con la base de datos establecida.');
    await sequelize.sync(); // Puedes usar { force: true } para desarrollo
    console.log('🛠️ Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
