// votacion-service/controllers/votacionController.js
import db from '../models/index.js'; // Importa el objeto 'db' que contiene todos los modelos

const Votacion = db.Votacion; // Accede al modelo Votacion a través del objeto db
const Candidato = db.Candidato; // Accede al modelo Candidato a través del objeto db

/**
 * @route POST /api/v1/votaciones
 * @description Crea un nuevo evento de votación. Requiere rol de administrador.
 * @access Privado (Requiere rol: admin)
 */
export const createVotacion = async (req, res) => {
    try {
        const { titulo, descripcion, fecha_inicio, fecha_fin } = req.body; // 'estado' se establece automáticamente

        // Validación básica de campos
        if (!titulo || !descripcion || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({ message: 'Todos los campos (titulo, descripcion, fecha_inicio, fecha_fin) son requeridos.' });
        }

        // Ya no verificamos el rol aquí; el middleware `authorizeRoles(['admin'])` lo hará antes.

        // Verificar si ya existe un evento de votación activo (estado 'abierta')
        const existingActiveVotacion = await Votacion.findOne({ where: { estado: 'abierta' } });
        if (existingActiveVotacion) {
            return res.status(409).json({ message: 'Ya existe un evento de votación activo. Cierre el anterior para crear uno nuevo.' });
        }

        // Crear el nuevo evento de votación
        const newVotacion = await Votacion.create({
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado: 'abierta', // Estado inicial por defecto al crear
        });

        res.status(201).json({ message: 'Evento de votación creado con éxito', votacion: newVotacion });
    } catch (error) {
        console.error('Error al crear el evento de votación:', error);
        res.status(500).json({ message: 'Error al crear el evento de votación', error: error.message });
    }
};

/**
 * @route GET /api/v1/votaciones/activa
 * @description Obtiene el evento de votación activo.
 * @access Público (si no se especifica autorización en la ruta)
 */
export const getActiveVotacion = async (req, res) => {
    try {
        const votaciones = await Votacion.findAll({
            where: { estado: 'abierta' },
            // Asegúrate de que los atributos coincidan con los de tu modelo Votacion
            attributes: ['id_votacion', 'titulo', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado']
        });

        if (votaciones.length === 0) {
            return res.status(404).json({ message: 'No hay ninguna votación activa en este momento.' });
        }
        // Si esperas solo una votación activa, devuelve la primera
        res.status(200).json(votaciones[0]);
    } catch (error) {
        console.error('Error al obtener la votación activa:', error);
        res.status(500).json({ message: 'Error al obtener la votación activa', error: error.message });
    }
};

/**
 * @route GET /api/v1/votaciones/:id_votacion
 * @description Obtiene un evento de votación por su ID.
 * @access Público (si no se especifica autorización en la ruta)
 */
export const getVotacionById = async (req, res) => {
    const { id_votacion } = req.params;
    try {
        const votacion = await Votacion.findByPk(id_votacion, {
            attributes: ['id_votacion', 'titulo', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado']
        });
        if (!votacion) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }
        res.status(200).json(votacion);
    } catch (error) {
        console.error('Error al obtener la votación por ID:', error);
        res.status(500).json({ message: 'Error al obtener la votación', error: error.message });
    }
};

/**
 * @route GET /api/v1/votaciones
 * @description Obtiene todos los eventos de votación (activos e inactivos).
 * @access Privado (Requiere rol: admin, profesor) - para auditoría
 */
export const getAllVotaciones = async (req, res) => {
    try {
        const votaciones = await Votacion.findAll({
            attributes: ['id_votacion', 'titulo', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado']
        });
        res.status(200).json(votaciones);
    } catch (error) {
        console.error('Error al obtener todos los eventos de votación:', error);
        res.status(500).json({ message: 'Error al obtener votaciones', error: error.message });
    }
};

/**
 * @route PUT /api/v1/votaciones/:id_votacion/estado
 * @description Actualiza el estado de una votación. Requiere rol de administrador.
 * @access Privado (Requiere rol: admin)
 */
export const updateVotacionEstado = async (req, res) => {
    const { id_votacion } = req.params;
    const { estado } = req.body; // 'abierta', 'cerrada', 'archivada'

    try {
        const votacion = await Votacion.findByPk(id_votacion);
        if (!votacion) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }

        // Validar el estado si es necesario
        const validStates = ['abierta', 'cerrada', 'archivada'];
        if (!validStates.includes(estado)) {
            return res.status(400).json({ message: 'Estado de votación inválido. Use "abierta", "cerrada" o "archivada".' });
        }

        // Si se intenta abrir una votación, verificar que no haya otra activa
        if (estado === 'abierta') {
            const existingActiveVotacion = await Votacion.findOne({ where: { estado: 'abierta' } });
            if (existingActiveVotacion && existingActiveVotacion.id_votacion !== votacion.id_votacion) {
                return res.status(409).json({ message: 'Ya existe otra votación activa. Cierre la anterior antes de abrir esta.' });
            }
        }

        await votacion.update({ estado });
        res.status(200).json({ message: `Estado de votación actualizado a "${estado}" correctamente.`, votacion });
    } catch (error) {
        console.error('Error al actualizar el estado de la votación:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la votación', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/votaciones/:id_votacion
 * @description Elimina un evento de votación por su ID. Requiere rol de administrador.
 * @access Privado (Requiere rol: admin)
 */
export const deleteVotacion = async (req, res) => {
    const { id_votacion } = req.params;
    try {
        const deletedCount = await Votacion.destroy({ where: { id_votacion } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Votación no encontrada.' });
        }
        res.status(204).send(); // 204 No Content para eliminación exitosa sin cuerpo de respuesta
    } catch (error) {
        console.error('Error al eliminar el evento de votación:', error);
        res.status(500).json({ message: 'Error al eliminar el evento de votación', error: error.message });
    }
};
