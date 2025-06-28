// comedor-service/controllers/menuController.js
import db from '../models/index.js';
import { Op } from 'sequelize'; // Importa Op para operadores de Sequelize

const Menu = db.Menu;

/**
 * @route POST /api/v1/menus
 * @description Crea un nuevo menú o actualiza uno existente para una fecha dada.
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const createOrUpdateMenu = async (req, res) => {
    const { date, breakfast, lunch, dinner } = req.body;

    if (!date) {
        return res.status(400).json({ message: 'La fecha es requerida para crear/actualizar un menú.' });
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        const [menu, created] = await Menu.findOrCreate({
            where: { date },
            defaults: {
                breakfast: breakfast || 'No disponible',
                lunch: lunch || 'No disponible',
                dinner: dinner || 'No disponible'
            }
        });

        if (!created) {
            // Si el menú ya existía, actualízalo
            await menu.update({
                breakfast: breakfast ?? menu.breakfast, // Use nullish coalescing to update only if provided
                lunch: lunch ?? menu.lunch,
                dinner: dinner ?? menu.dinner
            });
            console.log('Menú actualizado:', menu.toJSON());
            return res.status(200).json({ message: 'Menú actualizado exitosamente.', menu: menu.toJSON() });
        }

        console.log('Menú creado:', menu.toJSON());
        res.status(201).json({ message: 'Menú creado exitosamente.', menu: menu.toJSON() });

    } catch (error) {
        console.error('Error al crear/actualizar el menú:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el menú', error: error.message });
    }
};

/**
 * @route GET /api/v1/menus/today
 * @description Obtiene el menú del día actual. Si no existe, crea uno por defecto.
 * @access Autenticado (Cualquier rol)
 */
export const getMenuForToday = async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    try {
        let menu = await Menu.findOne({ where: { date: today } });

        if (!menu) {
            console.log('No existe menú para hoy, creando uno por defecto.');
            menu = await Menu.create({
                date: today,
                breakfast: 'Menú no disponible',
                lunch: 'Menú no disponible',
                dinner: 'Menú no disponible'
            });
        }
        res.status(200).json(menu.toJSON());
    } catch (error) {
        console.error('Error al obtener el menú de hoy:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el menú', error: error.message });
    }
};

/**
 * @route GET /api/v1/menus/:date
 * @description Obtiene el menú para una fecha específica.
 * @access Autenticado (Cualquier rol)
 */
export const getMenuByDate = async (req, res) => {
    const { date } = req.params;

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        const menu = await Menu.findOne({ where: { date } });

        if (!menu) {
            // Si no hay menú para la fecha, devuelve un menú con "no disponible"
            return res.status(404).json({
                message: 'Menú no encontrado para la fecha especificada. Se devolverá un menú por defecto.',
                menu: {
                    date,
                    breakfast: 'Menú no disponible',
                    lunch: 'Menú no disponible',
                    dinner: 'Menú no disponible'
                }
            });
        }
        res.status(200).json(menu.toJSON());
    } catch (error) {
        console.error('Error al obtener el menú por fecha:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el menú', error: error.message });
    }
};

/**
 * @route GET /api/v1/menus
 * @description Obtiene todos los menús (o los más recientes, con límite).
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll({
            order: [['date', 'DESC']],
            limit: 30 // Limitar a los 30 menús más recientes
        });
        res.status(200).json(menus);
    } catch (error) {
        console.error('Error al obtener todos los menús:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los menús', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/menus/:date
 * @description Elimina un menú por su fecha.
 * @access Privado (Requiere rol: admin)
 */
export const deleteMenuByDate = async (req, res) => {
    const { date } = req.params;

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        const deletedCount = await Menu.destroy({ where: { date } });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Menú no encontrado para la fecha especificada.' });
        }
        res.status(200).json({ message: 'Menú eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el menú:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el menú', error: error.message });
    }
};
