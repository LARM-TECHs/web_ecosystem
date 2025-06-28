// libreria-service/routes/bookRoutes.js
import express from 'express';
import { authorizeRoles } from '../middleware/auth.js'; // Importa el middleware de autorización
import {
    createBook,
    getAllBooks,
    getBookById,
    searchBooks,
    updateBook,
    deleteBook
} from '../controllers/bookController.js'; // Importa los controladores de libro

const router = express.Router();

// Rutas para la gestión de Libros

/**
 * @route POST /api/v1/libros
 * @description Crea un nuevo libro. Solo accesible para administradores y profesores.
 * @access Privado (Admin, Profesor)
 */
router.post('/', authorizeRoles(['admin', 'profesor']), createBook);

/**
 * @route GET /api/v1/libros
 * @description Obtiene todos los libros. Accesible para cualquier rol autenticado.
 * @access Autenticado (Cualquier rol)
 */
router.get('/', getAllBooks);

/**
 * @route GET /api/v1/libros/search
 * @description Busca libros por título, autor o clasificación. Accesible para cualquier rol autenticado.
 * @access Autenticado (Cualquier rol)
 */
router.get('/search', searchBooks); // Nota: Usa /libros/search para evitar conflicto con /libros/:id_libro

/**
 * @route GET /api/v1/libros/:id_libro
 * @description Obtiene un libro por su ID. Accesible para cualquier rol autenticado.
 * @access Autenticado (Cualquier rol)
 */
router.get('/:id_libro', getBookById);

/**
 * @route PUT /api/v1/libros/:id_libro
 * @description Actualiza la información de un libro. Solo accesible para administradores y profesores.
 * @access Privado (Admin, Profesor)
 */
router.put('/:id_libro', authorizeRoles(['admin', 'profesor']), updateBook);

/**
 * @route DELETE /api/v1/libros/:id_libro
 * @description Elimina un libro por su ID. Solo accesible para administradores.
 * @access Privado (Admin)
 */
router.delete('/:id_libro', authorizeRoles(['admin']), deleteBook);

export default router;
