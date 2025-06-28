// votacion-service/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicializa y configura la conexión a la base de datos para el microservicio votacion.
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
        define: {
            schema: process.env.DB_SCHEMA || 'votaciones', // Esquema específico para este servicio
            freezeTableName: true // Evita la pluralización automática de los nombres de tabla
        },
        dialectOptions: {
            // Opciones de dialecto específicas si son necesarias para PostgreSQL (ej: SSL)
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
        console.log('✅ Conexión a la base de datos establecida exitosamente para votacion-service.');

        const schema = process.env.DB_SCHEMA || 'votaciones';
        // Crear el esquema si no existe.
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
        console.log(`✅ Esquema '${schema}' asegurado/creado.`);

    } catch (error) {
        console.error('❌ Error al conectar o asegurar el esquema en la base de datos para votacion-service:', error);
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
        // La importación de index.js es suficiente, ya que index.js importa todos los modelos.
        // eslint-disable-next-line no-unused-vars
        const models = await import('../models/index.js');
        const schema = process.env.DB_SCHEMA || 'votaciones';
        await sequelize.query(`SET search_path TO "${schema}";`);

        // `alter: true` es bueno para desarrollo, pero puede ser peligroso en producción con datos existentes.
        // Para producción, se recomienda usar migraciones (ej. con Umzug o Sequelize CLI).
        await sequelize.sync({ alter: true });
        console.log(`✅ Modelos sincronizados en esquema "${schema}".`);
    } catch (error) {
        console.error('❌ Error al sincronizar los modelos de la base de datos para votacion-service:', error);
        process.exit(1);
    }
};

export default sequelize;