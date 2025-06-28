// votacion-service/controllers/votoController.js
import db from '../models/index.js';
import { Sequelize } from 'sequelize'; // Necesario para Sequelize.fn y Sequelize.col si se usan

const ConteoVotosCandidato = db.ConteoVotosCandidato; // Accede al modelo ConteoVotosCandidato
const Candidato = db.Candidato; // Accede al modelo Candidato
const Votacion = db.Votacion; // Accede al modelo Votacion
const RegistroVotoUsuario = db.RegistroVotoUsuario; // Accede al modelo RegistroVotoUsuario


/**
 * @route POST /api/v1/votar
 * @description Permite a un usuario emitir su voto en una elección activa.
 * @access Privado (Requiere rol: estudiante)
 */
export const castVote = async (req, res) => {
    try {
        const { id_votacion, id_presidente, id_miembros } = req.body; // Nombres de campos más claros
        const id_usuario = req.user.id; // ID del usuario autenticado desde el Gateway

        // 1. Validar la existencia de la votación
        const votacion = await Votacion.findByPk(id_votacion);
        if (!votacion) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }

        // 2. Verificar el estado de la votación
        if (votacion.estado !== 'abierta') {
            return res.status(403).json({ message: 'La votación no está abierta para recibir votos.' });
        }

        // 3. Verificar si el usuario ya ha votado en esta elección
        const hasVoted = await RegistroVotoUsuario.findOne({
            where: {
                id_usuario: id_usuario,
                id_votacion: id_votacion
            }
        });
        if (hasVoted) {
            return res.status(400).json({ message: 'Ya has votado en esta elección.' });
        }

        // 4. Validación de datos de entrada
        if (!id_presidente || !Array.isArray(id_miembros) || id_miembros.length === 0) {
            return res.status(400).json({ message: 'Datos de voto inválidos. Se requiere un presidente y al menos un miembro.' });
        }
        if (id_miembros.length !== 8) { // Según tu requisito original
            return res.status(400).json({ message: 'Debe seleccionar exactamente 8 miembros.' });
        }
        if (!id_miembros.includes(id_presidente)) {
            return res.status(400).json({ message: 'El candidato a presidente también debe estar entre los miembros seleccionados.' });
        }

        // 5. Verificar que los candidatos existan y pertenezcan a esta votación
        const allCandidateIds = [...new Set([id_presidente, ...id_miembros])]; // Eliminar duplicados
        const candidatesInVotacion = await Candidato.findAll({
            where: {
                id_candidato: allCandidateIds,
                id_votacion: id_votacion
            }
        });

        if (candidatesInVotacion.length !== allCandidateIds.length) {
            return res.status(400).json({ message: 'Uno o más candidatos no son válidos para esta votación.' });
        }

        // 6. Función para actualizar los conteos de votos de los candidatos
        const updateVoteCounts = async (candidateId, isPresident = false) => {
            const [conteoVoto, created] = await ConteoVotosCandidato.findOrCreate({
                where: { id_candidato: candidateId, id_votacion: id_votacion },
                defaults: { presidentVotes: 0, memberVotes: 0 },
            });

            if (isPresident) {
                conteoVoto.presidentVotes += 1;
            }
            conteoVoto.memberVotes += 1; // Un voto como miembro siempre se suma si es seleccionado
            await conteoVoto.save();
        };

        // 7. Votar al presidente (como presidente y miembro)
        await updateVoteCounts(id_presidente, true);

        // 8. Votar a los demás miembros (solo como miembros, si no es el presidente)
        for (const memberId of id_miembros) {
            if (memberId !== id_presidente) {
                await updateVoteCounts(memberId);
            }
        }

        // 9. Registrar que este usuario ya votó en esta elección
        await RegistroVotoUsuario.create({ id_usuario, id_votacion });

        res.status(200).json({ message: 'Voto registrado con éxito.' });
    } catch (error) {
        console.error('Error al registrar voto:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar el voto.', error: error.message });
    }
};

/**
 * @route GET /api/v1/votaciones/:id_votacion/resultados
 * @description Obtiene los resultados de una elección específica.
 * @access Público (o Privado, dependiendo de si los resultados son públicos o solo para admin/profesor)
 */
export const getVotacionResults = async (req, res) => {
    // Los resultados de votación suelen ser públicos o accesibles tras el cierre de la votación.
    // La autorización por rol se manejará en la ruta.
    const { id_votacion } = req.params; // Usa req.params para el ID de la votación en la URL

    try {
        // Verificar que la votación exista
        const votacion = await Votacion.findByPk(id_votacion);
        if (!votacion) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }

        // Opcional: Solo mostrar resultados si la votación está cerrada o archivada
        // if (votacion.estado === 'abierta') {
        //     return res.status(403).json({ message: 'Los resultados solo están disponibles una vez que la votación ha finalizado.' });
        // }

        const conteos = await ConteoVotosCandidato.findAll({
            where: { id_votacion: id_votacion },
            include: {
                model: Candidato,
                as: 'candidato', // Usar el alias definido en models/index.js
                attributes: ['id_candidato', 'nombre', 'carrera', 'anio', 'foto_url', 'biografia'] // Asegura los atributos correctos del candidato
            },
            order: [
                ['presidentVotes', 'DESC'], // Ordenar por votos de presidente primero
                ['memberVotes', 'DESC']      // Luego por votos de miembro
            ]
        });

        const resultados = conteos.map(conteo => ({
            id_candidato: conteo.candidato.id_candidato,
            nombre: conteo.candidato.nombre,
            carrera: conteo.candidato.carrera,
            anio: conteo.candidato.anio,
            foto_url: conteo.candidato.foto_url,
            biografia: conteo.candidato.biografia,
            presidentVotes: conteo.presidentVotes,
            memberVotes: conteo.memberVotes
        }));

        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener los resultados de la votación:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener resultados.', error: error.message });
    }
};

/**
 * @route GET /api/v1/votaciones/:id_votacion/votos-por-usuario
 * @description Obtiene todos los registros de votos de usuarios para una votación específica.
 * Útil para auditoría.
 * @access Privado (Requiere rol: admin)
 */
export const getVotesByUser = async (req, res) => {
    const { id_votacion } = req.params;

    try {
        const votacion = await Votacion.findByPk(id_votacion);
        if (!votacion) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }

        const registros = await RegistroVotoUsuario.findAll({
            where: { id_votacion: id_votacion },
            attributes: ['id_registro_voto_usuario', 'id_usuario', 'id_votacion', 'createdAt'],
            order: [['createdAt', 'ASC']]
        });

        // NOTA: Para obtener el nombre o correo del usuario, el cliente (frontend)
        // o un servicio intermedio (BFF) debería consultar al user-auth-service
        // usando los `id_usuario` devueltos aquí.
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al obtener registros de votos por usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener registros de votos.', error: error.message });
    }
};
