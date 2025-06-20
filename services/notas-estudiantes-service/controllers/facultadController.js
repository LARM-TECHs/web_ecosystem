// notas-estudiantes-service/controllers/facultadController.js
import { Facultad } from '../models/index.js';

// Agregar una facultad
export const createFacultad = async (req, res) => {
    const { nombre_facultad } = req.body;
    try {
        const existe = await Facultad.findOne({ where: { nombre_facultad: nombre_facultad } });
        if (existe) {
            return res.status(409).json({ message: "La facultad ya existe" });
        }
        const facultad = await Facultad.create({ nombre_facultad });
        res.status(201).json(facultad);
    } catch (error) {
        console.error('Error al agregar la facultad:', error);
        res.status(500).json({ message: 'Error al agregar la facultad', error: error.message });
    }
};

// Obtener todas las facultades
export const getAllFacultades = async (req, res) => {
    try {
        const facultades = await Facultad.findAll();
        res.json(facultades);
    } catch (error) {
        console.error('Error al obtener las facultades:', error);
        res.status(500).json({ message: 'Error al obtener las facultades', error: error.message });
    }
};

// Obtener una facultad por id
export const getFacultadById = async (req, res) => {
    const { id_facultad } = req.params;
    try {
        const facultad = await Facultad.findByPk(id_facultad);
        if (!facultad) return res.status(404).json({ message: "Facultad no encontrada" });
        res.json(facultad);
    } catch (error) {
        console.error('Error al obtener la facultad:', error);
        res.status(500).json({ message: 'Error al obtener la facultad', error: error.message });
    }
};

// Obtener una facultad por nombre
export const getFacultadByName = async (req, res) => {
    const { nombre_facultad } = req.params;
    try {
        const facultades = await Facultad.findAll({ where: { nombre_facultad: nombre_facultad } });
        res.json(facultades);
    } catch (error) {
        console.error('Error al obtener la facultad por nombre:', error);
        res.status(500).json({ message: 'Error al obtener la facultad por nombre', error: error.message });
    }
};

// Eliminar una facultad
export const deleteFacultad = async (req, res) => {
    const { id_facultad } = req.params;
    try {
        const deleted = await Facultad.destroy({ where: { id_facultad: id_facultad } });
        if (!deleted) return res.status(404).json({ message: "Facultad no encontrada" });
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la facultad:', error);
        res.status(500).json({ message: 'Error al eliminar la facultad', error: error.message });
    }
};

// Actualizar una facultad
export const updateFacultad = async (req, res) => {
    const { id_facultad } = req.params;
    const { nombre_facultad } = req.body;
    try {
        const [updated] = await Facultad.update(
            { nombre_facultad: nombre_facultad },
            { where: { id_facultad: id_facultad } }
        );
        if (!updated) return res.status(404).json({ message: "Facultad no encontrada" });
        res.status(200).json({ message: "Facultad actualizada correctamente." });
    } catch (error) {
        console.error('Error al actualizar la facultad:', error);
        res.status(500).json({ message: 'Error al actualizar la facultad', error: error.message });
    }
};