// votacion-service/controllers/candidateController.js
import db from '../models/index.js'; // Importa los modelos con los nuevos nombres

const Candidato = db.Candidato; // Accede al modelo Candidato
const Votacion = db.Votacion; // Accede al modelo Votacion

/**
 * @route GET /api/v1/candidatos
 * @description Obtiene todos los candidatos registrados en el sistema de votación.
 * @access Autenticado (rol: cualquier rol válido)
 */
export const getAllCandidates = async (req, res) => {
    try {
        const candidatos = await Candidato.findAll();
        res.status(200).json(candidatos);
    } catch (error) {
        console.error('Error al obtener todos los candidatos:', error);
        res.status(500).json({ message: 'Error al obtener los candidatos', error: error.message });
    }
};

/**
 * @route GET /api/v1/candidatos/buscarPorNombre
 * @description Busca un candidato por su nombre. Los parámetros de búsqueda deben ir en la query string.
 * @access Autenticado (rol: cualquier rol válido)
 */
export const searchCandidateByName = async (req, res) => {
    const { nombre } = req.query; // Para búsquedas en GET, usa req.query
    if (!nombre) {
        return res.status(400).json({ message: 'Se requiere el parámetro "nombre" para la búsqueda.' });
    }

    try {
        const candidato = await Candidato.findOne({ where: { nombre: nombre } }); // Asegura la condición del WHERE
        if (!candidato) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }
        res.status(200).json(candidato);
    } catch (error) {
        console.error('Error al buscar el candidato por nombre:', error);
        res.status(500).json({ message: 'Error al buscar el candidato', error: error.message });
    }
};

/**
 * @route GET /api/v1/candidatos/porVotacion/:id_votacion
 * @description Obtiene todos los candidatos asociados a una votación específica por su ID.
 * @access Autenticado (rol: cualquier rol válido)
 */
export const getCandidatesByVotacion = async (req, res) => {
    const { id_votacion } = req.params; // Para IDs en la URL, usa req.params

    if (!id_votacion) {
        return res.status(400).json({ message: 'Se requiere el parámetro "id_votacion".' });
    }

    try {
        // Incluye la relación con la votación para verificar su estado si es necesario
        const candidatos = await Candidato.findAll({
            where: { id_votacion: id_votacion },
            include: [{ model: Votacion, as: 'votacion' }]
        });

        if (candidatos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron candidatos para la votación especificada.' });
        }

        res.status(200).json(candidatos);
    } catch (error) {
        console.error('Error al obtener candidatos por votación:', error);
        res.status(500).json({ message: 'Error al obtener candidatos por votación', error: error.message });
    }
};

/**
 * @route POST /api/v1/candidatos
 * @description Crea un nuevo candidato. Requiere una votación activa y rol de administrador/profesor.
 * @access Privado (Requiere rol: admin, profesor)
 * @notes Asume que hay un middleware de subida de archivos (ej. Multer) configurado antes de este controlador
 * para manejar `req.file`. Para producción, las imágenes deberían subirse a un servicio de almacenamiento
 * en la nube (ej. S3, Google Cloud Storage) en lugar de un path local.
 */
export const createCandidate = async (req, res) => {
    try {
        const { nombre, carrera, anio, biografia } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!nombre || !carrera || !anio || !biografia) {
            return res.status(400).json({ message: 'Todos los campos (nombre, carrera, anio, biografia) son requeridos.' });
        }

        let foto_url = null;
        // Verifica si llegó una imagen a través del middleware de Multer
        if (req.file) {
            // Construye la URL local. Para producción, esto debería ser una URL de CDN/almacenamiento en la nube.
            foto_url = `${req.protocol}://${req.get('host')}/uploads/candidatos/${req.file.filename}`;
        } else {
            // Si la foto es obligatoria, descomentar la siguiente línea
            // return res.status(400).json({ message: 'Se requiere una foto para el candidato.' });
            // Si no es obligatoria, foto_url se mantendrá null o se puede asignar una URL por defecto
        }

        // Validar si hay una votación activa (estado 'abierta')
        const activeVotacion = await Votacion.findOne({ where: { estado: 'abierta' } });
        if (!activeVotacion) {
            return res.status(400).json({ message: 'No hay ninguna votación activa en este momento para registrar candidatos.' });
        }

        // Verificar si el candidato ya está registrado en la votación activa
        const existingCandidate = await Candidato.findOne({
            where: {
                nombre: nombre,
                id_votacion: activeVotacion.id_votacion // Usa el ID de la votación activa
            },
        });

        if (existingCandidate) {
            return res.status(409).json({ message: 'El candidato ya está registrado en esta votación activa' });
        }

        // Crear candidato
        const newCandidate = await Candidato.create({
            nombre,
            carrera,
            anio,
            biografia,
            foto_url,
            id_votacion: activeVotacion.id_votacion // Asocia al ID de la votación activa
        });

        res.status(201).json({ message: 'Candidato creado correctamente', candidato: newCandidate });
    } catch (error) {
        console.error('Error al crear candidato:', error);
        res.status(500).json({ message: 'Error al crear candidato', error: error.message });
    }
};

/**
 * @route PUT /api/v1/candidatos/:id_candidato
 * @description Actualiza un candidato existente por su ID.
 * @access Privado (Requiere rol: admin, profesor)
 */
export const updateCandidate = async (req, res) => {
    const { id_candidato } = req.params;
    const { nombre, carrera, anio, biografia } = req.body;

    try {
        const candidato = await Candidato.findByPk(id_candidato);
        if (!candidato) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        // Si se envía una nueva foto, actualizar la URL
        if (req.file) {
            candidato.foto_url = `${req.protocol}://${req.get('host')}/uploads/candidatos/${req.file.filename}`;
        }

        // Actualizar los campos que se proporcionen
        await candidato.update({
            nombre: nombre || candidato.nombre,
            carrera: carrera || candidato.carrera,
            anio: anio || candidato.anio,
            biografia: biografia || candidato.biografia,
            // foto_url se maneja por separado si hay req.file
        });

        res.status(200).json({ message: 'Candidato actualizado con éxito', candidato });
    } catch (error) {
        console.error('Error al actualizar el candidato:', error);
        res.status(500).json({ message: 'Error al actualizar el candidato', error: error.message });
    }
};


/**
 * @route DELETE /api/v1/candidatos/:id_candidato
 * @description Elimina un candidato por su ID.
 * @access Privado (Requiere rol: admin)
 */
export const deleteCandidate = async (req, res) => {
    const { id_candidato } = req.params; // Usa id_candidato para consistencia con el modelo

    try {
        const candidato = await Candidato.findByPk(id_candidato);
        if (!candidato) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        await candidato.destroy();
        res.status(200).json({ message: 'Candidato eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el candidato:', error);
        res.status(500).json({ message: 'Error al eliminar el candidato', error: error.message });
    }
};
