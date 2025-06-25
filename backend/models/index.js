const sequelize = require('../config/db');

// Importar modelos
const User = require('./User');
const Menu = require('./menu');
const QRCode = require('./qrcode');
const Staff = require('./staff');
const Student = require('./student');

// Relaciones entre modelos
Student.belongsTo(User, { foreignKey: 'user_id' });
Staff.belongsTo(User, { foreignKey: 'user_id' });
QRCode.belongsTo(Student, { foreignKey: 'student_id' });
Menu.hasMany(QRCode, { foreignKey: 'menu_id' });

// Función de conexión
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    await sequelize.sync();
    console.log('📦 Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = connectDB; // 👈 importante
