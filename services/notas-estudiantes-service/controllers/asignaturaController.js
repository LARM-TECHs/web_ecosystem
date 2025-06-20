// notas-estudiantes-service/controllers/asignaturaController.js
import { Asignatura, Carrera, CarreraAsignatura, EstudianteProfile, Brigada } from '../models/index.js';

// Agregar una asignatura
export const createAsignatura = async (req, res) => {
    const { nombre_asignatura } = req.body;
    try {
        const asignatura = await Asignatura.create({ nombre_asignatura });
        res.status(201).json(asignatura);
    } catch (error) {
        console.error('Error al agregar la asignatura:', error);
        res.status(500).json({ message: 'Error al agregar la asignatura', error: error.message });
    }
};

// Agregar una asignatura a una carrera
export const addAsignaturaToCarrera = async (req, res) => {
    const { id_carrera, id_asignatura } = req.body;
    try {
        const carrera = await Carrera.findByPk(id_carrera);
        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!carrera || !asignatura) {
            return res.status(404).json({ message: 'Carrera o Asignatura no encontrada.' });
        }
        const relacion = await CarreraAsignatura.create({ id_carrera, id_asignatura });
        res.status(201).json(relacion);
    } catch (error) {
        console.error('Error al agregar la asignatura a la carrera:', error);
        res.status(500).json({ message: 'Error al agregar la asignatura a la carrera', error: error.message });
    }
};

// Obtener todas las asignaturas
export const getAllAsignaturas = async (req, res) => {
    try {
        const asignaturas = await Asignatura.findAll();
        res.json(asignaturas);
    } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
        res.status(500).json({ message: 'Error al obtener las asignaturas', error: error.message });
    }
};

// Obtener una asignatura por ID
export const getAsignaturaById = async (req, res) => {
    const { id_asignatura } = req.params;
    try {
        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.json(asignatura);
    } catch (error) {
        console.error('Error al obtener la asignatura:', error);
        res.status(500).json({ message: 'Error al obtener la asignatura', error: error.message });
    }
};

// Obtener una asignatura por nombre
export const getAsignaturaByName = async (req, res) => {
    const { nombre_asignatura } = req.params;
    try {
        const asignaturas = await Asignatura.findAll({ where: { nombre_asignatura: nombre_asignatura } });
        res.json(asignaturas);
    } catch (error) {
        console.error('Error al obtener la asignatura por nombre:', error);
        res.status(500).json({ message: 'Error al obtener la asignatura por nombre', error: error.message });
    }
};

// Obtener asignaturas por carrera
export const getAsignaturasByCarrera = async (req, res) => {
    const { id_carrera } = req.params;
    try {
        const carrera = await Carrera.findByPk(id_carrera, {
            include: {
                model: Asignatura,
                as: 'asignaturas',
                through: { attributes: [] }
            }
        });
        if (!carrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.json(carrera.asignaturas);
    } catch (error) {
        console.error('Error al obtener las asignaturas por carrera:', error);
        res.status(500).json({ message: 'Error al obtener las asignaturas por carrera', error: error.message });
    }
};

// Obtener asignaturas por carrera e id_asignatura
export const getAsignaturaByCarreraAndId = async (req, res) => {
    const { id_carrera, id_asignatura } = req.params;
    try {
        const carreraInstance = await Carrera.findByPk(id_carrera, {
            include: {
                model: Asignatura,
                as: 'asignaturas',
                where: { id_asignatura: id_asignatura },
                through: { attributes: [] }
            }
        });
        if (!carreraInstance || carreraInstance.asignaturas.length === 0) {
            return res.status(404).json({ message: 'Asignatura no encontrada para esa carrera' });
        }
        res.json(carreraInstance.asignaturas[0]);
    } catch (error) {
        console.error('Error al obtener la asignatura por carrera y id:', error);
        res.status(500).json({ message: 'Error al obtener la asignatura por carrera y id', error: error.message });
    }
};

// Eliminar una asignatura
export const deleteAsignatura = async (req, res) => {
    const { id_asignatura } = req.params;
    try {
        const deleted = await Asignatura.destroy({ where: { id_asignatura: id_asignatura } });
        if (!deleted) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la asignatura:', error);
        res.status(500).json({ message: 'Error al eliminar la asignatura', error: error.message });
    }
};

// Eliminar asignatura de una carrera
export const removeAsignaturaFromCarrera = async (req, res) => {
    const { id_carrera, id_asignatura } = req.params;
    try {
        const deleted = await CarreraAsignatura.destroy({
            where: {
                id_carrera: id_carrera,
                id_asignatura: id_asignatura,
            },
        });
        if (!deleted) return res.status(404).json({ message: 'Relación Carrera-Asignatura no encontrada' });
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la asignatura de la carrera:', error);
        res.status(500).json({ message: 'Error al eliminar la asignatura de la carrera', error: error.message });
    }
};

// Actualizar una asignatura
export const updateAsignatura = async (req, res) => {
    const { id_asignatura } = req.params;
    const { nombre_asignatura } = req.body;
    try {
        const [updated] = await Asignatura.update(
            { nombre_asignatura: nombre_asignatura },
            { where: { id_asignatura: id_asignatura } }
        );
        if (!updated) return res.status(404).json({ message: 'Asignatura no encontrada' });
        res.status(200).json({ message: "Asignatura actualizada correctamente." });
    } catch (error) {
        console.error('Error al actualizar la asignatura:', error);
        res.status(500).json({ message: 'Error al actualizar la asignatura', error: error.message });
    }
};

// Obtener asignaturas por la carrera de la brigada
export const getAsignaturasByBrigadaCarrera = async (req, res) => {
    const { id_brigada } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        if (userRole === 'estudiante') {
            const studentProfile = await EstudianteProfile.findOne({
                where: { id_usuario: userId, id_brigada: id_brigada }
            });
            if (!studentProfile) {
                return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver asignaturas de esta brigada.' });
            }
        }

        const brigada = await Brigada.findByPk(id_brigada, {
            include: {
                model: Carrera,
                as: 'carrera',
                include: {
                    model: Asignatura,
                    as: 'asignaturas',
                    through: { attributes: [] }
                }
            }
        });

        if (!brigada) return res.status(404).json({ message: 'Brigada no encontrada' });

        const asignaturas = brigada.carrera ? brigada.carrera.asignaturas : [];
        res.json(asignaturas);

    } catch (error) {
        console.error('Error al obtener las asignaturas de la brigada:', error);
        res.status(500).json({ message: 'Error al obtener las asignaturas de la brigada', error: error.message });
    }
};