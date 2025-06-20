// notas-estudiantes-service/controllers/brigadaController.js
import { Brigada, Carrera } from '../models/index.js';

// Agregar una brigada
export const createBrigada = async (req, res) => {
    const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
    try {
        const carrera = await Carrera.findByPk(id_carrera);
        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada.' });
        }
        const brigada = await Brigada.create({ id_carrera, nombre_brigada, año_brigada, añoFinal_brigada });
        res.status(201).json(brigada);
    } catch (error) {
        console.error('Error al agregar la brigada:', error);
        res.status(500).json({ message: 'Error al agregar la brigada', error: error.message });
    }
};

// Obtener todas las brigadas
export const getAllBrigadas = async (req, res) => {
    try {
        const brigadas = await Brigada.findAll({ include: [{ model: Carrera, as: 'carrera' }] });
        res.json(brigadas);
    } catch (error) {
        console.error('Error al obtener las brigadas:', error);
        res.status(500).json({ message: 'Error al obtener las brigadas', error: error.message });
    }
};

// Obtener una brigada por id
export const getBrigadaById = async (req, res) => {
    const { id_brigada } = req.params;
    try {
        const brigada = await Brigada.findByPk(id_brigada, { include: [{ model: Carrera, as: 'carrera' }] });
        if (!brigada) {
            return res.status(404).json({ message: "Brigada no encontrada" });
        }
        res.json(brigada);
    } catch (error) {
        console.error('Error al obtener la brigada:', error);
        res.status(500).json({ message: 'Error al obtener la brigada', error: error.message });
    }
};

// Obtener brigadas por carrera
export const getBrigadasByCarrera = async (req, res) => {
    const { id_carrera } = req.params;
    try {
        const brigadas = await Brigada.findAll({ where: { id_carrera: id_carrera }, include: [{ model: Carrera, as: 'carrera' }] });
        res.json(brigadas);
    } catch (error) {
        console.error('Error al obtener brigadas por carrera:', error);
        res.status(500).json({ message: 'Error al obtener brigadas por carrera', error: error.message });
    }
};

// Obtener una brigada por nombre
export const getBrigadaByName = async (req, res) => {
    const { nombre_brigada } = req.params;
    try {
        const brigadas = await Brigada.findAll({ where: { nombre_brigada: nombre_brigada }, include: [{ model: Carrera, as: 'carrera' }] });
        res.json(brigadas);
    } catch (error) {
        console.error('Error al obtener la brigada por nombre:', error);
        res.status(500).json({ message: 'Error al obtener la brigada por nombre', error: error.message });
    }
};

// Eliminar una brigada
export const deleteBrigada = async (req, res) => {
    const { id_brigada } = req.params;
    try {
        const deleted = await Brigada.destroy({ where: { id_brigada: id_brigada } });
        if (!deleted) {
            return res.status(404).json({ message: "Brigada no encontrada" });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la brigada:', error);
        res.status(500).json({ message: 'Error al eliminar la brigada', error: error.message });
    }
};

// Actualizar una brigada
export const updateBrigada = async (req, res) => {
    const { id_brigada } = req.params;
    const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
    try {
        const [updated] = await Brigada.update(
            { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada },
            { where: { id_brigada: id_brigada } }
        );
        if (!updated) {
            return res.status(404).json({ message: "Brigada no encontrada" });
        }
        const updatedBrigada = await Brigada.findByPk(id_brigada);
        res.status(200).json(updatedBrigada);
    } catch (error) {
        console.error('Error al actualizar la brigada:', error);
        res.status(500).json({ message: 'Error al actualizar la brigada', error: error.message });
    }
};