// libreria-service/controllers/loanController.js
import db from '../models/index.js'; // Importa el objeto db que contiene tus modelos

const Prestamo = db.Prestamo; // Accede al modelo Prestamo
const Libro = db.Libro;       // También necesitamos el modelo Libro para actualizar copias

/**
 * @route POST /api/v1/prestamos
 * @description Registra un nuevo préstamo de libro.
 * @access Privado (Requiere rol: admin, profesor, estudiante)
 * @notes Un estudiante solo podrá prestarse a sí mismo. Admin/Profesor pueden prestar a cualquiera.
 */
export const createLoan = async (req, res) => {
    const { id_libro, loanDate, returnDate } = req.body;
    const id_usuario_solicitud = req.user.id; // ID del usuario que hace la solicitud desde el Gateway
    const rol_usuario_solicitud = req.user.rol; // Rol del usuario que hace la solicitud

    // Si un admin/profesor puede prestar a otros, el body debería incluir id_usuario_destino
    const id_usuario_destino = (rol_usuario_solicitud === 'admin' || rol_usuario_solicitud === 'profesor') && req.body.id_usuario
        ? req.body.id_usuario // Admin/profesor especifica a quién
        : id_usuario_solicitud; // Estudiante se presta a sí mismo

    try {
        // 1. Validar datos de entrada
        if (!id_libro || !loanDate || !returnDate || !id_usuario_destino) {
            return res.status(400).json({ message: 'ID del libro, fechas de préstamo/devolución y ID de usuario son requeridos.' });
        }

        // 2. Verificar que el libro exista y tenga copias disponibles
        const libro = await Libro.findByPk(id_libro);
        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado en el catálogo.' });
        }
        if (libro.copies <= 0) {
            return res.status(400).json({ message: 'No hay copias disponibles de este libro para préstamo.' });
        }

        // 3. Registrar el préstamo
        const newPrestamo = await Prestamo.create({
            id_libro: id_libro,
            id_usuario: id_usuario_destino, // El ID del usuario al que se presta
            loanDate: loanDate,
            returnDate: returnDate,
            status: 'prestado' // Estado inicial
        });

        // 4. Reducir el número de copias disponibles del libro
        await libro.update({ copies: libro.copies - 1 });

        res.status(201).json({ message: 'Préstamo registrado exitosamente.', prestamo: newPrestamo });
    } catch (error) {
        console.error('Error al registrar préstamo:', error);
        res.status(500).json({ message: 'Error al registrar el préstamo', error: error.message });
    }
};

/**
 * @route GET /api/v1/prestamos
 * @description Obtiene todos los préstamos. Para administradores, todos. Para profesores/estudiantes, solo los suyos.
 * @access Privado (Requiere rol: admin, profesor, estudiante)
 */
export const getAllLoans = async (req, res) => {
    const id_usuario = req.user.id;
    const rol_usuario = req.user.rol;

    let whereClause = {};
    // Si no es admin, solo puede ver sus propios préstamos
    if (rol_usuario !== 'admin') {
        whereClause.id_usuario = id_usuario;
    }

    try {
        const prestamos = await Prestamo.findAll({
            where: whereClause,
            include: [{ model: Libro, as: 'libro' }], // Incluye la información del libro asociado
            order: [['loanDate', 'DESC']]
        });
        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).json({ message: 'Error al obtener préstamos', error: error.message });
    }
};

/**
 * @route GET /api/v1/prestamos/:id_prestamo
 * @description Obtiene un préstamo específico por su ID.
 * @access Privado (Requiere rol: admin, profesor, estudiante)
 * @notes Estudiante solo puede ver su propio préstamo.
 */
export const getLoanById = async (req, res) => {
    const { id_prestamo } = req.params;
    const id_usuario = req.user.id;
    const rol_usuario = req.user.rol;

    try {
        const prestamo = await Prestamo.findByPk(id_prestamo, {
            include: [{ model: Libro, as: 'libro' }]
        });

        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }

        // Si no es admin, verifica que el préstamo pertenezca al usuario que lo solicita
        if (rol_usuario !== 'admin' && String(prestamo.id_usuario) !== String(id_usuario)) {
            return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para ver este préstamo.' });
        }

        res.status(200).json(prestamo);
    } catch (error) {
        console.error('Error al obtener préstamo por ID:', error);
        res.status(500).json({ message: 'Error al obtener el préstamo', error: error.message });
    }
};

/**
 * @route PUT /api/v1/prestamos/:id_prestamo/devolver
 * @description Marca un préstamo como devuelto y actualiza la cantidad de copias del libro.
 * @access Privado (Requiere rol: admin, profesor)
 */
export const returnLoan = async (req, res) => {
    const { id_prestamo } = req.params;
    const { actualReturnDate } = req.body; // Opcional: Fecha de devolución real

    try {
        const prestamo = await Prestamo.findByPk(id_prestamo);
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }

        if (prestamo.status === 'devuelto') {
            return res.status(400).json({ message: 'Este libro ya ha sido devuelto.' });
        }

        // Actualizar estado del préstamo
        await prestamo.update({
            status: 'devuelto',
            actualReturnDate: actualReturnDate || new Date() // Si no se provee, usa la fecha actual
        });

        // Aumentar el número de copias disponibles del libro
        const libro = await Libro.findByPk(prestamo.id_libro);
        if (libro) {
            await libro.update({ copies: libro.copies + 1 });
        }

        res.status(200).json({ message: 'Préstamo marcado como devuelto exitosamente.', prestamo });
    } catch (error) {
        console.error('Error al devolver préstamo:', error);
        res.status(500).json({ message: 'Error al devolver el préstamo', error: error.message });
    }
};

/**
 * @route GET /api/v1/prestamos/usuario/:id_usuario
 * @description Obtiene todos los préstamos de un usuario específico.
 * @access Privado (Requiere rol: admin, profesor, o el propio estudiante)
 */
export const getLoansByUserId = async (req, res) => {
    const { id_usuario } = req.params; // El ID del usuario cuyos préstamos se quieren ver
    const id_usuario_solicitud = req.user.id; // ID del usuario autenticado
    const rol_usuario_solicitud = req.user.rol; // Rol del usuario autenticado

    // Un estudiante solo puede ver sus propios préstamos
    if (rol_usuario_solicitud === 'estudiante' && String(id_usuario_solicitud) !== String(id_usuario)) {
        return res.status(403).json({ message: 'Acceso denegado: Solo puede ver sus propios préstamos.' });
    }

    try {
        const prestamos = await Prestamo.findAll({
            where: { id_usuario: id_usuario },
            include: [{ model: Libro, as: 'libro' }],
            order: [['loanDate', 'DESC']]
        });
        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos por usuario:', error);
        res.status(500).json({ message: 'Error al obtener préstamos por usuario', error: error.message });
    }
};


/**
 * @route DELETE /api/v1/prestamos/:id_prestamo
 * @description Elimina un registro de préstamo por su ID.
 * @access Privado (Requiere rol: admin)
 * @notes No incrementa las copias del libro porque se asume que solo se elimina un registro de un préstamo ya devuelto o erróneo.
 * Para préstamos activos, usar la ruta de "devolver".
 */
export const deleteLoan = async (req, res) => {
    const { id_prestamo } = req.params;
    try {
        const deleted = await Prestamo.destroy({ where: { id_prestamo: id_prestamo } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }

        res.status(200).json({ message: 'Préstamo eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar préstamo:', error);
        res.status(500).json({ message: 'Error al eliminar el préstamo', error: error.message });
    }
};
