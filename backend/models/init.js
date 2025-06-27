// models/init.js
const sequelize = require('../config/db');

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

module.exports = connectDB;
