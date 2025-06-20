// notas-estudiantes-service/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Optionally, keep these logs for initial debugging, but consider removing for production
console.log('DB_NAME:', process.env.DB_NAME, typeof process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER, typeof process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : null, typeof process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST, typeof process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT, typeof process.env.DB_PORT);
console.log('DB_DIALECT:', process.env.DB_DIALECT, typeof process.env.DB_DIALECT);
console.log('DB_SCHEMA (from env):', process.env.DB_SCHEMA, typeof process.env.DB_SCHEMA);


/**
 * Inicializa y configura la conexión a la base de datos para el microservicio notas-estudiantes.
 * Utiliza las variables de entorno para las credenciales y el esquema.
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        // Ensure port is parsed as a number, as process.env values are strings
        port: Number(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres', // Use DB_DIALECT from .env, with 'postgres' as fallback
        logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log queries only in development
        // Define el esquema por defecto para todos los modelos asociados a esta instancia de Sequelize.
        // Esto asegura que las tablas se creen en el esquema 'notes' o el que se especifique en DB_SCHEMA.
        define: {
            schema: process.env.DB_SCHEMA || 'notes', // Use DB_SCHEMA from .env, with 'notes' as fallback
            freezeTableName: true // Evita la pluralización automática de los nombres de tabla
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
        console.log('✅ Conexión a la base de datos establecida exitosamente para notas-estudiantes.');

        const schema = process.env.DB_SCHEMA || 'notes';
        // Crear el esquema si no existe. Esto es una operación DDL.
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
        console.log(`✅ Esquema '${schema}' asegurado/creado.`);

    } catch (error) {
        console.error('❌ Error al conectar o asegurar el esquema en la base de datos para notas-estudiantes:', error);
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
        // NOTA: Con `define: { schema: 'your_schema' }` en la instancia de Sequelize,
        // Sequelize ya intenta crear las tablas en ese esquema.
        // `SET search_path` puede ser redundante pero no hace daño para asegurar.
        const schema = process.env.DB_SCHEMA || 'notes';
        await sequelize.query(`SET search_path TO "${schema}";`); // Asegura el path de búsqueda para la sesión.

        // `alter: true` es bueno para desarrollo, pero puede ser peligroso en producción con datos existentes.
        // Para producción, se recomienda usar migraciones (ej. con Umzug o Sequelize CLI).
        await sequelize.sync({ alter: true });
        console.log(`✅ Modelos sincronizados en esquema "${schema}".`);
    } catch (error) {
        console.error('❌ Error al sincronizar los modelos de la base de datos para notas-estudiantes:', error);
        process.exit(1);
    }
};

export default sequelize;