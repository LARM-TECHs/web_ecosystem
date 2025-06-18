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
    process.env.DB_NAME,     // Nombre de la base de datos, ej: 'ecosystem_db'
    process.env.DB_USER,     // Usuario de PostgreSQL, ej: 'postgres'
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        dialect: process.env.DB_DIALECT || 'postgres', // fallback si falta en .env
        logging: process.env.NODE_ENV === 'development' ? console.log : false,

        // 👇 Asegúrate que el schema sea aplicado después en cada modelo o globalmente con searchPath
        // dialectOptions: {
        //     options: {
        //         encrypt: false
        //     }
        // }
    }
);

// 👉 Establecer esquema por defecto global (si usas múltiples esquemas por microservicio)
sequelize
    .authenticate()
    .then(async () => {
        await sequelize.createSchema(process.env.DB_SCHEMA || 'llm', { ifNotExists: true });
        await sequelize.query(`SET search_path TO ${process.env.DB_SCHEMA || 'llm'};`);
        console.log(`Conexión exitosa y esquema "${process.env.DB_SCHEMA || 'llm'}" listo.`);
    })
    .catch((err) => {
        console.error('Error al conectar con la base de datos:', err);
    });

export default sequelize;
