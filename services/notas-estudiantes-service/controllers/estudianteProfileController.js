// notas-estudiantes-service/controllers/estudianteProfileController.js
import { EstudianteProfile, Brigada, Carrera, Facultad } from '../models/index.js';

// Crear un perfil de estudiante
export const createEstudianteProfile = async (req, res) => {
    const { id_usuario, nombre_completo, numero_matricula, id_brigada } = req.body;
    try {
        const existingProfile = await EstudianteProfile.findOne({ where: { id_usuario } });
        if (existingProfile) {
            return res.status(409).json({ message: 'Un perfil de estudiante para este usuario ya existe.' });
        }
        const estudianteProfile = await EstudianteProfile.create({
            id_usuario,
            nombre_completo,
            numero_matricula,
            id_brigada
        });
        res.status(201).json(estudianteProfile);
    } catch (error) {
        console.error('Error al agregar el perfil de estudiante:', error);
        res.status(500).json({ message: 'Error al agregar el perfil de estudiante', error: error.message });
    }
};

// Obtener todos los perfiles de estudiantes
export const getAllEstudianteProfiles = async (req, res) => {
    try {
        const estudiantes = await EstudianteProfile.findAll({
            include: [{
                model: Brigada,
                as: 'brigada',
                include: [{
                    model: Carrera,
                    as: 'carrera',
                    include: [{ model: Facultad, as: 'facultad' }]
                }]
            }]
        });
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener los perfiles de estudiantes:', error);
        res.status(500).json({ message: 'Error al obtener los perfiles de estudiantes', error: error.message });
    }
};

// Obtener un perfil de estudiante por su ID de perfil
export const getEstudianteProfileById = async (req, res) => {
    const { id_estudiante_profile } = req.params;
    try {
        const estudianteProfile = await EstudianteProfile.findByPk(id_estudiante_profile, {
            include: [{
                model: Brigada,
                as: 'brigada',
                include: [{
                    model: Carrera,
                    as: 'carrera',
                    include: [{ model: Facultad, as: 'facultad' }]
                }]
            }]
        });
        if (!estudianteProfile) {
            return res.status(404).json({ message: 'Perfil de estudiante no encontrado' });
        }
        res.json(estudianteProfile);
    } catch (error) {
        console.error('Error al obtener el perfil de estudiante:', error);
        res.status(500).json({ message: 'Error al obtener el perfil de estudiante', error: error.message });
    }
};

// Obtener el perfil de estudiante del usuario autenticado
export const getMyEstudianteProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const estudianteProfile = await EstudianteProfile.findOne({
            where: { id_usuario: userId },
            include: [{
                model: Brigada,
                as: 'brigada',
                include: [{
                    model: Carrera,
                    as: 'carrera',
                    include: [{ model: Facultad, as: 'facultad' }]
                }]
            }]
        });
        if (!estudianteProfile) {
            return res.status(404).json({ message: 'Perfil de estudiante no encontrado para el usuario actual.' });
        }
        res.json(estudianteProfile);
    } catch (error) {
        console.error('Error al obtener el perfil del estudiante autenticado:', error);
        res.status(500).json({ message: 'Error al obtener el perfil del estudiante', error: error.message });
    }
};

// Obtener un perfil de estudiante por ID de usuario
export const getEstudianteProfileByUserId = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const estudianteProfile = await EstudianteProfile.findOne({
            where: { id_usuario: id_usuario },
            include: [{
                model: Brigada,
                as: 'brigada',
                include: [{
                    model: Carrera,
                    as: 'carrera',
                    include: [{ model: Facultad, as: 'facultad' }]
                }]
            }]
        });
        if (!estudianteProfile) {
            return res.status(404).json({ message: 'Perfil de estudiante no encontrado para este ID de usuario.' });
        }
        res.json(estudianteProfile);
    } catch (error) {
        console.error('Error al obtener el perfil de estudiante por ID de usuario:', error);
        res.status(500).json({ message: 'Error al obtener el perfil de estudiante', error: error.message });
    }
};


// Obtener estudiantes por brigada
export const getEstudiantesByBrigada = async (req, res) => {
    const { id_brigada } = req.params;
    try {
        const estudiantes = await EstudianteProfile.findAll({
            where: { id_brigada: id_brigada },
            include: [{
                model: Brigada,
                as: 'brigada',
                include: [{
                    model: Carrera,
                    as: 'carrera',
                    include: [{ model: Facultad, as: 'facultad' }]
                }]
            }]
        });
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por brigada:', error);
        res.status(500).json({ message: 'Error al obtener estudiantes por brigada', error: error.message });
    }
};

// Actualizar un perfil de estudiante
export const updateEstudianteProfile = async (req, res) => {
    const { id_estudiante_profile } = req.params;
    const { nombre_completo, numero_matricula, id_brigada } = req.body;
    try {
        const [updated] = await EstudianteProfile.update(
            { nombre_completo, numero_matricula, id_brigada },
            { where: { id_estudiante_profile: id_estudiante_profile } }
        );
        if (!updated) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado" });
        }
        res.status(200).json({ message: "Perfil de estudiante actualizado correctamente." });
    } catch (error) {
        console.error('Error al actualizar el perfil de estudiante:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil de estudiante', error: error.message });
    }
};

// Eliminar un perfil de estudiante
export const deleteEstudianteProfile = async (req, res) => {
    const { id_estudiante_profile } = req.params;
    try {
        const deleted = await EstudianteProfile.destroy({ where: { id_estudiante_profile: id_estudiante_profile } });
        if (!deleted) {
            return res.status(404).json({ message: "Perfil de estudiante no encontrado" });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el perfil de estudiante:', error);
        res.status(500).json({ message: 'Error al eliminar el perfil de estudiante', error: error.message });
    }
};