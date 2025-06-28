// libreria-service/controllers/selectionController.js
import db from '../models/index.js'; // Importa el objeto db que contiene tus modelos

const Seleccion = db.Seleccion; // Accede al modelo Seleccion
const Libro = db.Libro; // Necesario si la selección es de un libro existente

/**
 * @route POST /api/v1/selecciones
 * @description Crea un nuevo registro de selección.
 * @access Privado (Requiere rol: admin, profesor, estudiante)
 * @notes Asumo que 'Seleccion' es para un tipo de "reserva" o "lista de deseos".
 * Si la 'selection' es de un libro que ya existe en el catálogo, podemos vincularlo.
 * Si es un 'request' de un libro no existente, las columnas 'book', 'author', 'publisher' tienen más sentido.
 * He implementado esto asumiendo que es una "reserva" o "interés" de un `Libro` existente.
 */
export const createSelection = async (req, res) => {
    // Si la selección es de un libro del catálogo: id_libro
    // Si la selección es una sugerencia/solicitud de un libro no catalogado: book, author, publisher
    const { id_libro, book, author, publisher, quantity } = req.body;
    const id_usuario = req.user.id; // Quién hizo la selección

    try {
        // Si se proporciona id_libro, se asume que es una selección de un libro existente
        if (id_libro) {
            const libro = await Libro.findByPk(id_libro);
            if (!libro) {
                return res.status(404).json({ message: 'Libro no encontrado en el catálogo para esta selección.' });
            }
            // Aquí podrías añadir lógica para reducir copias si es una "reserva" formal.
            // Para una simple "selección" o "lista de deseos", no reduces copias.
            // Dejaré la lógica de copias para Prestamos.

            const newSeleccion = await Seleccion.create({
                id_libro,
                book: libro.title, // Desnormaliza el título
                author: libro.author, // Desnormaliza el autor
                quantity: quantity || 1, // Cantidad por defecto 1
                // id_usuario: id_usuario // Descomentar si la selección es por usuario
            });
            return res.status(201).json({ message: 'Selección de libro existente registrada.', seleccion: newSeleccion });
        } else if (book && author && quantity) {
            // Si no se proporciona id_libro, es una sugerencia de libro (no catalogado aún)
            const newSeleccion = await Seleccion.create({
                book,
                author,
                publisher,
                quantity,
                // id_usuario: id_usuario // Descomentar si la sugerencia es por usuario
            });
            return res.status(201).json({ message: 'Sugerencia de libro registrada.', seleccion: newSeleccion });
        } else {
            return res.status(400).json({ message: 'Datos incompletos para crear una selección. Proporcione id_libro o (book, author, quantity).' });
        }

    } catch (error) {
        console.error('Error al registrar selección:', error);
        res.status(500).json({ message: 'Error al registrar la selección', error: error.message });
    }
};

/**
 * @route GET /api/v1/selecciones
 * @description Obtiene todas las selecciones.
 * @access Privado (Requiere rol: admin, profesor)
 * @notes Si la selección fuera por usuario, un estudiante solo vería las suyas.
 */
export const getAllSelections = async (req, res) => {
    try {
        const selecciones = await Seleccion.findAll({
            include: [{ model: Libro, as: 'libro', required: false }], // Incluye el libro si está vinculado
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(selecciones);
    } catch (error) {
        console.error('Error al obtener selecciones:', error);
        res.status(500).json({ message: 'Error al obtener selecciones', error: error.message });
    }
};

/**
 * @route GET /api/v1/selecciones/:id_seleccion
 * @description Obtiene una selección por su ID.
 * @access Privado (Requiere rol: admin, profesor)
 * @notes Si la selección fuera por usuario, un estudiante solo vería la suya.
 */
export const getSelectionById = async (req, res) => {
    const { id_seleccion } = req.params;
    try {
        const seleccion = await Seleccion.findByPk(id_seleccion, {
            include: [{ model: Libro, as: 'libro', required: false }]
        });
        if (!seleccion) {
            return res.status(404).json({ message: 'Selección no encontrada.' });
        }
        res.status(200).json(seleccion);
    } catch (error) {
        console.error('Error al obtener selección por ID:', error);
        res.status(500).json({ message: 'Error al obtener la selección', error: error.message });
    }
};

/**
 * @route PUT /api/v1/selecciones/:id_seleccion
 * @description Actualiza la información de una selección.
 * @access Privado (Requiere rol: admin, profesor)
 */
export const updateSelection = async (req, res) => {
    const { id_seleccion } = req.params;
    const { id_libro, book, author, publisher, quantity } = req.body;

    try {
        const seleccion = await Seleccion.findByPk(id_seleccion);
        if (!seleccion) {
            return res.status(404).json({ message: 'Selección no encontrada.' });
        }

        // Si se actualiza id_libro, verificar que exista
        if (id_libro && id_libro !== seleccion.id_libro) {
            const libro = await Libro.findByPk(id_libro);
            if (!libro) {
                return res.status(404).json({ message: 'Nuevo libro para la selección no encontrado.' });
            }
        }

        await seleccion.update({
            id_libro: id_libro ?? seleccion.id_libro,
            book: book ?? seleccion.book,
            author: author ?? seleccion.author,
            publisher: publisher ?? seleccion.publisher,
            quantity: quantity ?? seleccion.quantity
        });

        res.status(200).json({ message: 'Selección actualizada exitosamente.', seleccion });
    } catch (error) {
        console.error('Error al actualizar selección:', error);
        res.status(500).json({ message: 'Error al actualizar la selección', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/selecciones/:id_seleccion
 * @description Elimina un registro de selección por su ID.
 * @access Privado (Requiere rol: admin)
 */
export const deleteSelection = async (req, res) => {
    const { id_seleccion } = req.params;
    try {
        const deleted = await Seleccion.destroy({ where: { id_seleccion: id_seleccion } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Selección no encontrada.' });
        }

        res.status(200).json({ message: 'Selección eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar selección:', error);
        res.status(500).json({ message: 'Error al eliminar la selección', error: error.message });
    }
};
