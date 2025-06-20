// services/chatLlm/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicializa y configura la conexión a la base de datos para el microservicio chat-llm.
 * Utiliza las variables de entorno para las credenciales y el esquema.
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        // Define el esquema por defecto para todos los modelos asociados a esta instancia de Sequelize.
        // Esto asegura que las tablas se creen en el esquema 'llm' o el que se especifique.
        define: {
            schema: process.env.DB_SCHEMA || 'llm'
        },
        // Opciones de dialecto específicas para PostgreSQL si fuera necesario.
        dialectOptions: {
            // Ejemplo: ssl: { require: true, rejectUnauthorized: false } para SSL
        }
    }
);

/**
 * Función para probar la conexión a la base de datos y asegurar/crear el esquema.
 * @async
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida exitosamente para chat-llm.');

        const schema = process.env.DB_SCHEMA || 'llm';
        // Crear el esquema si no existe
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
        console.log(`✅ Esquema '${schema}' asegurado/creado.`);

    } catch (error) {
        console.error('❌ Error al conectar o asegurar el esquema en la base de datos para chat-llm:', error);
        process.exit(1); // Sale del proceso si la conexión falla
    }
};

/**
 * Función para sincronizar los modelos con la base de datos.
 * Esto creará o alterará las tablas dentro del esquema especificado.
 * @async
 * @returns {Promise<void>}
 */
export const syncModels = async () => {
    try {
        // Importa todos los modelos para asegurar que Sequelize los conozca antes de sincronizar
        // eslint-disable-next-line no-unused-vars
        const models = await import('../models/index.js');
        // Aseguramos que el search_path esté configurado para las operaciones de sincronización
        // Aunque el 'define.schema' ya ayuda, un SET search_path explícito puede ser útil en algunos casos.
        const schema = process.env.DB_SCHEMA || 'llm';
        await sequelize.query(`SET search_path TO "${schema}";`);

        await sequelize.sync({ alter: true }); // 'alter: true' intenta hacer cambios no destructivos en la tabla
        console.log(`✅ Modelos sincronizados en esquema "${schema}"`);
    } catch (error) {
        console.error('❌ Error al sincronizar los modelos de la base de datos para chat-llm:', error);
        process.exit(1);
    }
};

export default sequelize;
