import sequelize from '../config/db.js';

// importación de modelos también usando ES Modules
import User from './User.js';
import Chat from './Chat.js';
import Admin from './Admin.js';
import Role from './Role.js';
import Trace from './Trace.js';

// Definir relaciones (si no las defines en cada modelo)
User.hasMany(Chat, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Trace, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trace.belongsTo(User, { foreignKey: 'user_id' });

// Sincronización de modelos
const syncModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL exitosa');

        // Establecer el esquema si no existe
        const schema = process.env.DB_SCHEMA || 'llm';
        await sequelize.createSchema(schema, { ifNotExists: true });
        await sequelize.query(`SET search_path TO ${schema};`);

        // Sincronizar modelos
        await sequelize.sync({ alter: true }); // Cambia a force: true si necesitas reiniciar la base
        console.log(`✅ Modelos sincronizados en el esquema "${schema}"`);
    } catch (error) {
        console.error('❌ Error al conectar o sincronizar:', error);
    }
};

export {
    sequelize,
    User,
    Chat,
    Admin,
    Role,
    Trace,
    syncModels
};
