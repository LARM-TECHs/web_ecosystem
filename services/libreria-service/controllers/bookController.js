// libreria-service/controllers/bookController.js
import db from '../models/index.js'; // Importa el objeto db que contiene tus modelos
import { Op } from 'sequelize';

const Libro = db.Libro; // Accede al modelo Libro

/**
 * @route POST /api/v1/libros
 * @description Crea un nuevo libro en el catálogo de la librería.
 * @access Privado (Requiere rol: admin, profesor)
 */
export const createBook = async (req, res) => {
    const { title, author, classification, publicationDate, copies, type, location } = req.body;
    try {
        // Validación básica
        if (!title || !author || !classification || copies == null) {
            return res.status(400).json({ message: 'Título, autor, clasificación y número de copias son requeridos.' });
        }
        if (copies < 0) {
            return res.status(400).json({ message: 'El número de copias no puede ser negativo.' });
        }

        const newLibro = await Libro.create({
            title,
            author,
            classification,
            publicationDate,
            copies,
            type,
            location
        });
        res.status(201).json({ message: 'Libro registrado exitosamente.', libro: newLibro });
    } catch (error) {
        console.error('Error al registrar libro:', error);
        res.status(500).json({ message: 'Error al registrar el libro', error: error.message });
    }
};

/**
 * @route GET /api/v1/libros
 * @description Obtiene todos los libros del catálogo.
 * @access Autenticado (Cualquier rol)
 */
export const getAllBooks = async (req, res) => {
    try {
        const libros = await Libro.findAll({
            order: [['title', 'ASC']] // Ordena por título por defecto
        });
        res.status(200).json(libros);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ message: 'Error al obtener libros', error: error.message });
    }
};

/**
 * @route GET /api/v1/libros/:id_libro
 * @description Obtiene un libro por su ID.
 * @access Autenticado (Cualquier rol)
 */
export const getBookById = async (req, res) => {
    const { id_libro } = req.params;
    try {
        const libro = await Libro.findByPk(id_libro);
        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }
        res.status(200).json(libro);
    } catch (error) {
        console.error('Error al obtener libro por ID:', error);
        res.status(500).json({ message: 'Error al obtener el libro', error: error.message });
    }
};

/**
 * @route GET /api/v1/libros/search
 * @description Busca libros por título, autor o clasificación.
 * @access Autenticado (Cualquier rol)
 */
export const searchBooks = async (req, res) => {
    const { query } = req.query; // Parámetro de búsqueda general

    if (!query) {
        return res.status(400).json({ message: 'Se requiere un término de búsqueda.' });
    }

    try {
        const libros = await Libro.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } }, // Case-insensitive LIKE
                    { author: { [Op.iLike]: `%${query}%` } },
                    { classification: { [Op.iLike]: `%${query}%` } }
                ]
            },
            order: [['title', 'ASC']]
        });
        res.status(200).json(libros);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        res.status(500).json({ message: 'Error al buscar libros', error: error.message });
    }
};

/**
 * @route PUT /api/v1/libros/:id_libro
 * @description Actualiza la información de un libro.
 * @access Privado (Requiere rol: admin, profesor)
 */
export const updateBook = async (req, res) => {
    const { id_libro } = req.params;
    const { title, author, classification, publicationDate, copies, type, location } = req.body;

    try {
        const libro = await Libro.findByPk(id_libro);
        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        // Validación de copias si se actualiza
        if (copies !== undefined && copies < 0) {
            return res.status(400).json({ message: 'El número de copias no puede ser negativo.' });
        }

        await libro.update({
            title: title ?? libro.title, // Nullish coalescing para actualizar solo si se proporciona
            author: author ?? libro.author,
            classification: classification ?? libro.classification,
            publicationDate: publicationDate ?? libro.publicationDate,
            copies: copies ?? libro.copies,
            type: type ?? libro.type,
            location: location ?? libro.location
        });

        res.status(200).json({ message: 'Libro actualizado exitosamente.', libro });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        res.status(500).json({ message: 'Error al actualizar el libro', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/libros/:id_libro
 * @description Elimina un libro por su ID.
 * @access Privado (Requiere rol: admin)
 */
export const deleteBook = async (req, res) => {
    const { id_libro } = req.params;
    try {
        const deleted = await Libro.destroy({ where: { id_libro: id_libro } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        res.status(200).json({ message: 'Libro eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
    }
};
