// votacion-service/models/index.js
import sequelize from '../config/db.js';
import Votacion from './Votacion.js';
import Candidato from './Candidato.js';
import RegistroVotoUsuario from './RegistroVotoUsuario.js';
import ConteoVotosCandidato from './ConteoVotosCandidato.js';

// Definir asociaciones
// Una votación puede tener muchos candidatos
Votacion.hasMany(Candidato, { foreignKey: 'id_votacion', as: 'candidatos' });
Candidato.belongsTo(Votacion, { foreignKey: 'id_votacion', as: 'votacion' });

// Una votación puede tener muchos registros de votos de usuario
Votacion.hasMany(RegistroVotoUsuario, { foreignKey: 'id_votacion', as: 'registrosVotoUsuario' });
RegistroVotoUsuario.belongsTo(Votacion, { foreignKey: 'id_votacion', as: 'votacion' });

// Una votación puede tener muchos conteos de votos de candidato
Votacion.hasMany(ConteoVotosCandidato, { foreignKey: 'id_votacion', as: 'conteoVotosCandidato' });
ConteoVotosCandidato.belongsTo(Votacion, { foreignKey: 'id_votacion', as: 'votacion' });

// Un candidato puede tener un conteo de votos (en una votación específica)
Candidato.hasOne(ConteoVotosCandidato, { foreignKey: 'id_candidato', as: 'conteoVotos' });
ConteoVotosCandidato.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });


const db = {
    sequelize,
    Votacion,
    Candidato,
    RegistroVotoUsuario,
    ConteoVotosCandidato,
};

export default db; // Exporta todos los modelos y la instancia de sequelize
