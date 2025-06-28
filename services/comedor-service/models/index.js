// comedor-service/models/index.js
import sequelize from '../config/db.js';
import Menu from './Menu.js'; // Menu debe ir antes de QRCode
import StudentComedor from './StudentComedor.js'; // StudentComedor debe ir antes de QRCode
import Staff from './Staff.js'; // Staff puede ir aquí, no tiene dependencias cruzadas con QR
import QRCode from './QRCode.js'; // QRCode debe ir después de Menu y StudentComedor

// Definir asociaciones
// Un Menú puede tener muchos QRCodes
Menu.hasMany(QRCode, { foreignKey: 'menu_id', as: 'qrcodes' });
QRCode.belongsTo(Menu, { foreignKey: 'menu_id', as: 'menu' });

// Un StudentComedor puede tener muchos QRCodes
StudentComedor.hasMany(QRCode, { foreignKey: 'student_comedor_id', as: 'qrcodes' });
QRCode.belongsTo(StudentComedor, { foreignKey: 'student_comedor_id', as: 'studentComedor' });

const db = {
    sequelize,
    Menu,
    QRCode,
    Staff,
    StudentComedor,
};

export default db; // Exporta todos los modelos y la instancia de sequelize
