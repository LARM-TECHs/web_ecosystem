// notas-estudiantes-service/controllers/carreraController.js
import { Carrera, Facultad, Asignatura } from '../models/index.js';

// Agregar una carrera
export const createCarrera = async (req, res) => {
    const { id_facultad, nombre_carrera, años } = req.body;
    try {
        const facultad = await Facultad.findByPk(id_facultad);
        if (!facultad) {
            return res.status(404).json({ message: 'Facultad no encontrada.' });
        }
        const carrera = await Carrera.create({ id_facultad, nombre_carrera, años });
        res.status(201).json(carrera);
    } catch (error) {
        console.error('Error al agregar la carrera:', error);
        res.status(500).json({ message: 'Error al agregar la carrera', error: error.message });
    }
};

// Obtener todas las carreras
export const getAllCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.findAll({ include: [{ model: Facultad, as: 'facultad' }] });
        res.json(carreras);
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        res.status(500).json({ message: 'Error al obtener las carreras', error: error.message });
    }
};

// Obtener una carrera por id
export const getCarreraById = async (req, res) => {
    const { id_carrera } = req.params;
    try {
        const carrera = await Carrera.findByPk(id_carrera, { include: [{ model: Facultad, as: 'facultad' }] });
        if (!carrera) return res.status(404).json({ message: "Carrera no encontrada" });
        res.json(carrera);
    } catch (error) {
        console.error('Error al obtener la carrera:', error);
        res.status(500).json({ message: 'Error al obtener la carrera', error: error.message });
    }
};

// Obtener carreras por facultad
export const getCarrerasByFacultad = async (req, res) => {
    const { id_facultad } = req.params;
    try {
        const carreras = await Carrera.findAll({ where: { id_facultad: id_facultad }, include: [{ model: Facultad, as: 'facultad' }] });
        res.json(carreras);
    } catch (error) {
        console.error('Error al obtener carreras por facultad:', error);
        res.status(500).json({ message: 'Error al obtener carreras por facultad', error: error.message });
    }
};

// Obtener carrera por nombre
export const getCarreraByName = async (req, res) => {
    const { nombre_carrera } = req.params;
    try {
        const carreras = await Carrera.findAll({ where: { nombre_carrera: nombre_carrera }, include: [{ model: Facultad, as: 'facultad' }] });
        res.json(carreras);
    } catch (error) {
        console.error('Error al obtener la carrera por nombre:', error);
        res.status(500).json({ message: 'Error al obtener la carrera por nombre', error: error.message });
    }
};

// Eliminar una carrera
export const deleteCarrera = async (req, res) => {
    const { id_carrera } = req.params;
    try {
        const deleted = await Carrera.destroy({ where: { id_carrera: id_carrera } });
        if (!deleted) return res.status(404).json({ message: "Carrera no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        res.status(500).json({ message: 'Error al eliminar la carrera', error: error.message });
    }
};

// Actualizar una carrera
export const updateCarrera = async (req, res) => {
    const { id_carrera } = req.params;
    const { id_facultad, nombre_carrera, años } = req.body;
    try {
        const [updated] = await Carrera.update(
            { id_facultad, nombre_carrera, años },
            { where: { id_carrera: id_carrera } }
        );
        if (!updated) return res.status(404).json({ message: "Carrera no encontrada" });
        res.status(200).json({ message: "Carrera actualizada correctamente." });
    } catch (error) {
        console.error('Error al actualizar la carrera:', error);
        res.status(500).json({ message: 'Error al actualizar la carrera', error: error.message });
    }
};