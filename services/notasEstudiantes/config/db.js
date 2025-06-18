import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_NAME:', process.env.DB_NAME, typeof process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER, typeof process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : null, typeof process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST, typeof process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT, typeof process.env.DB_PORT);
console.log('DB_DIALECT:', process.env.DB_DIALECT, typeof process.env.DB_DIALECT);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        define: {
            schema: 'notes', // Establece el esquema por defecto
            freezeTableName: true // Evita pluralización automática
        },
        logging: false // Puedes activarlo si quieres ver las queries
    }
);

export default sequelize;
