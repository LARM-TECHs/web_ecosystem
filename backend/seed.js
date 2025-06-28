const sequelize = require('./config/db');
const Student = require('./models/student');
const Staff = require('./models/staff');
const Menu = require('./models/menu');
const QRCode = require('./models/qrcode');


async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('🔄 Base de datos sincronizada');

    // Insertar estudiantes
    await Student.bulkCreate([
      {
        student_id: '2021001',
        name: 'Ana López',
        email: 'ana.lopez@example.com'
      },
      {
        student_id: '2021002',
        name: 'Luis Pérez',
        email: 'luis.perez@example.com'
      }
    ]);

    // Insertar personal
    await Staff.create({
      staff_id: 'admin001',
      name: 'Administrador Uno',
      email: 'admin@comedor.com',
      password: 'admin123' // asegúrate que en el modelo pueda ser texto plano por ahora
    });



    console.log('✅ Base de datos poblada exitosamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();
