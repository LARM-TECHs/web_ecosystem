import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicializa y configura la conexión a la base de datos utilizando Sequelize.
 * Las credenciales y la configuración se obtienen de las variables de entorno.
 */
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA, // Aquí se usa el esquema definido en .env
        logging: false // Desactiva el log de SQL en la consola
    }
);

/**
 * Función para probar la conexión a la base de datos y crear el esquema si no existe.
 * @async
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida exitosamente.');

        // Crear el esquema si no existe
        if (process.env.DB_SCHEMA) {
            await sequelize.createSchema(process.env.DB_SCHEMA, { logging: false });
            console.log(`✅ Esquema '${process.env.DB_SCHEMA}' asegurado/creado.`);
        }

    } catch (error) {
        console.error('❌ Error al conectar o asegurar el esquema en la base de datos:', error);
        process.exit(1); // Sale del proceso si la conexión falla
    }
};

/**
 * Sincroniza los modelos de Sequelize con la base de datos.
 * Esto creará las tablas si no existen dentro del esquema especificado.
 * @async
 * @returns {Promise<void>}
 */
export const syncDB = async () => {
    try {
        // Importa los modelos aquí para asegurar que estén definidos antes de sincronizar
        // eslint-disable-next-line no-unused-vars
        const { Usuario } = await import('../models/Usuario.js');
        await sequelize.sync({ alter: true }); // 'alter: true' intenta hacer cambios no destructivos en la tabla
        console.log('🔄 Modelos de base de datos sincronizados dentro del esquema.');
    } catch (error) {
        console.error('❌ Error al sincronizar los modelos de la base de datos:', error);
        process.exit(1);
    }
};
