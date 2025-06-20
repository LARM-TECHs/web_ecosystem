// services/chatLlm/models/index.js
import sequelize from '../config/db.js';
import Chat from './Chat.js';
import Trace from './Trace.js';

// *** IMPORTANTE: No se importa User, Admin, Role aquí
// ya que su gestión es responsabilidad del user-auth-service. ***

/**
 * Función para sincronizar los modelos con la base de datos,
 * asegurando que se creen o actualicen dentro del esquema definido.
 * Esta función es la que se llama desde server.js para inicializar la DB.
 *
 * NOTA: La lógica de creación de esquema y setear search_path se ha movido
 * a `config/db.js` en `connectDB` y `syncModels` para centralizar la configuración de DB.
 */
export async function syncAllModels() {
    // Sequelize.sync() con `alter: true` ya se encarga de crear las tablas
    // dentro del esquema que se le configuró a la instancia de `sequelize`.
    // La lógica de `createSchema` y `SET search_path` se gestiona en `config/db.js`.
    console.log('Iniciando sincronización de modelos para chat-llm...');
    await sequelize.sync({ alter: true });
    console.log(`✅ Modelos sincronizados en esquema "${process.env.DB_SCHEMA || 'llm'}"`);
}

// Exporta los modelos que pertenecen a este microservicio
export { Chat, Trace };

// Si Chat y Trace tuvieran relaciones directas entre sí (dentro de este servicio),
// se definirían aquí. Por ejemplo:
// Chat.hasMany(Trace, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
// Trace.belongsTo(Chat, { foreignKey: 'chat_id' });
// Pero el diseño actual de Trace parece ser un log más general, no directamente ligado a un 'chat' específico.
