// notas-estudiantes-service/controllers/notaController.js
import { Nota, Asignatura, EstudianteProfile, sequelize } from '../models/index.js';

// Agregar una nota
export const createNota = async (req, res) => {
    const { id_estudiante_profile, id_asignatura, valor, año } = req.body;
    try {
        const estudianteProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
        const asignatura = await Asignatura.findByPk(id_asignatura);
        if (!estudianteProfile || !asignatura) {
            return res.status(404).json({ message: 'Perfil de estudiante o Asignatura no encontrada.' });
        }

        const nota = await Nota.create({
            id_estudiante: id_estudiante_profile,
            id_asignatura,
            valor,
            año
        });
        res.status(201).json(nota);
    } catch (error) {
        console.error('Error al agregar la nota:', error);
        res.status(500).json({ message: 'Error al agregar la nota', error: error.message });
    }
};

// Obtener una nota por ID
export const getNotaById = async (req, res) => {
    const { id_nota } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        const nota = await Nota.findByPk(id_nota, {
            include: [
                { model: Asignatura, as: 'asignatura' },
                { model: EstudianteProfile, as: 'estudiante' }
            ]
        });

        if (!nota) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        if (userRole === 'estudiante' && String(nota.estudiante.id_usuario) !== userId) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver esta nota.' });
        }

        res.json(nota);
    } catch (error) {
        console.error('Error al obtener la nota:', error);
        res.status(500).json({ message: 'Error al obtener la nota', error: error.message });
    }
};

// Obtener notas por estudiante
export const getNotasByEstudiante = async (req, res) => {
    const { id_estudiante_profile } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        const studentProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
        if (!studentProfile) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado." });
        }

        if (userRole === 'estudiante' && String(studentProfile.id_usuario) !== userId) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver las notas de este estudiante.' });
        }

        const notas = await Nota.findAll({
            where: { id_estudiante: id_estudiante_profile },
            include: [{ model: Asignatura, as: 'asignatura' }],
            order: [['año', 'ASC']]
        });
        res.json(notas);
    } catch (error) {
        console.error('Error al obtener notas por estudiante:', error);
        res.status(500).json({ message: 'Error al obtener notas por estudiante', error: error.message });
    }
};

// Obtener notas por estudiante y año
export const getNotasByEstudianteAndYear = async (req, res) => {
    const { id_estudiante_profile, año } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        const studentProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
        if (!studentProfile) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado." });
        }

        if (userRole === 'estudiante' && String(studentProfile.id_usuario) !== userId) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver las notas de este estudiante.' });
        }

        const notas = await Nota.findAll({
            where: {
                id_estudiante: id_estudiante_profile,
                año: año
            },
            include: [{ model: Asignatura, as: 'asignatura' }]
        });
        res.json(notas);
    } catch (error) {
        console.error('Error al obtener notas por estudiante y año:', error);
        res.status(500).json({ message: 'Error al obtener notas por estudiante y año', error: error.message });
    }
};

// Obtener nota por asignatura y estudiante
export const getNotaByAsignaturaAndEstudiante = async (req, res) => {
    const { id_asignatura, id_estudiante_profile } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        const studentProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
        if (!studentProfile) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado." });
        }

        if (userRole === 'estudiante' && String(studentProfile.id_usuario) !== userId) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver esta nota.' });
        }

        const notas = await Nota.findAll({
            where: {
                id_asignatura: id_asignatura,
                id_estudiante: id_estudiante_profile
            },
            include: [{ model: Asignatura, as: 'asignatura' }]
        });
        res.json(notas);
    } catch (error) {
        console.error('Error al obtener la nota por asignatura y estudiante:', error);
        res.status(500).json({ message: 'Error al obtener la nota por asignatura y estudiante', error: error.message });
    }
};

// Eliminar una nota
export const deleteNota = async (req, res) => {
    const { id_nota } = req.params;
    try {
        const deleted = await Nota.destroy({ where: { id_nota: id_nota } });
        if (!deleted) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la nota:', error);
        res.status(500).json({ message: 'Error al eliminar la nota', error: error.message });
    }
};

// Actualizar una nota
export const updateNota = async (req, res) => {
    const { id_nota } = req.params;
    const { id_estudiante_profile, id_asignatura, valor, año } = req.body;

    try {
        if (id_estudiante_profile) {
            const estudianteProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
            if (!estudianteProfile) return res.status(404).json({ message: 'Perfil de estudiante no encontrado.' });
        }
        if (id_asignatura) {
            const asignatura = await Asignatura.findByPk(id_asignatura);
            if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada.' });
        }

        const [updatedRowsCount] = await Nota.update(
            { id_estudiante: id_estudiante_profile, id_asignatura, valor, año },
            { where: { id_nota: id_nota } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        const updatedNota = await Nota.findByPk(id_nota);
        res.status(200).json(updatedNota);
    } catch (error) {
        console.error('Error al actualizar la nota:', error);
        res.status(500).json({ message: 'Error al actualizar la nota', error: error.message });
    }
};

// Obtener el promedio de un estudiante
export const getEstudianteAverage = async (req, res) => {
    const { id_estudiante_profile } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    try {
        const studentProfile = await EstudianteProfile.findByPk(id_estudiante_profile);
        if (!studentProfile) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado." });
        }

        if (userRole === 'estudiante' && String(studentProfile.id_usuario) !== userId) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver el promedio de este estudiante.' });
        }

        const result = await Nota.findOne({
            attributes: [
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('valor')), 1), 'promedio']
            ],
            where: { id_estudiante: id_estudiante_profile }
        });

        res.json(result);
    } catch (err) {
        console.error('Error al obtener el promedio:', err);
        res.status(500).json({ message: 'Error al obtener el promedio', error: err.message });
    }
};