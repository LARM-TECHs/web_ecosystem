// comedor-service/controllers/studentComedorController.js
import db from '../models/index.js'; // Importa el objeto db con todos los modelos
import axios from 'axios';           // Para hacer llamadas HTTP a otros microservicios
import dotenv from 'dotenv';         // Para acceder a las variables de entorno

dotenv.config();

const StudentComedor = db.StudentComedor;
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:4000';

/**
 * @route POST /api/v1/students-comedor
 * @description Registra un nuevo estudiante en el sistema del comedor.
 * Requiere que el user_id proporcionado exista en el user-auth-service y que el rol sea 'estudiante'.
 * @access Privado (Requiere rol: admin, o el propio estudiante registrándose)
 */
export const registerStudentComedor = async (req, res) => {
    const { student_id, name, email, user_id } = req.body;
    const authUserId = req.headers['x-user-id'];
    const authUserEmail = req.headers['x-user-correo'];
    const authUserRole = req.headers['x-user-rol'];

    // Validación básica
    if (!student_id || !name || !email || !user_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    console.log(`[StudentComedorController] Auth headers: ID=${authUserId}, Email=${authUserEmail}, Role=${authUserRole}`);
    console.log(`[StudentComedorController] Body: student_id=${student_id}, name=${name}, email=${email}, user_id_body=${user_id}`);

    // Validar permisos y consistencia
    if (authUserRole === 'estudiante') {
        if (String(user_id) !== String(authUserId)) {
            return res.status(403).json({ message: 'Un estudiante solo puede registrarse a sí mismo.' });
        }
        if (authUserEmail !== email) {
            return res.status(400).json({ message: 'El correo no coincide con el del token.' });
        }
    } else if (authUserRole !== 'admin') {
        return res.status(403).json({ message: 'Rol no autorizado.' });
    }

    try {
        const [student, created] = await StudentComedor.findOrCreate({
            where: { user_id },
            defaults: { student_id, name, email, user_id }
        });

        if (!created) {
            // Actualizar datos si existen cambios
            await student.update({ student_id, name, email });
            return res.status(200).json({ message: 'Estudiante actualizado.', student });
        }
        res.status(201).json({ message: 'Estudiante registrado exitosamente.', student });
    } catch (error) {
        console.error('[StudentComedorController] Error:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

/**
 * @route GET /api/v1/students-comedor
 * @description Obtiene todos los estudiantes registrados en el sistema del comedor.
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const getAllStudentsComedor = async (req, res) => {
    try {
        const students = await StudentComedor.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(students);
    } catch (error) {
        console.error('[StudentComedorController] Error al obtener todos los estudiantes del comedor:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estudiantes del comedor', error: error.message });
    }
};

/**
 * @route GET /api/v1/students-comedor/me
 * @description Obtiene el perfil del estudiante del comedor asociado al usuario autenticado.
 * @access Privado (Requiere rol: estudiante)
 */
export const getMyStudentComedorProfile = async (req, res) => {
    const authenticatedUserId = req.user.id;
    const authenticatedUserRole = req.user.rol;

    if (authenticatedUserRole !== 'estudiante') {
        return res.status(403).json({ message: 'Acceso denegado: Esta ruta es solo para estudiantes.' });
    }

    try {
        const studentComedor = await StudentComedor.findOne({
            where: { user_id: authenticatedUserId }
        });

        if (!studentComedor) {
            return res.status(404).json({ message: 'No se encontró un perfil de estudiante del comedor asociado a su usuario.' });
        }

        res.status(200).json(studentComedor.toJSON());
    } catch (error) {
        console.error('[StudentComedorController] Error al obtener el perfil de mi estudiante del comedor:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener su perfil de estudiante del comedor', error: error.message });
    }
};


/**
 * @route GET /api/v1/students-comedor/:id
 * @description Obtiene un estudiante del comedor por su ID interno (primary key).
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const getStudentComedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const studentComedor = await StudentComedor.findByPk(id);
        if (!studentComedor) {
            return res.status(404).json({ message: 'Estudiante del comedor no encontrado.' });
        }
        res.status(200).json(studentComedor.toJSON());
    } catch (error) {
        console.error('[StudentComedorController] Error al obtener estudiante del comedor por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estudiante del comedor', error: error.message });
    }
};

/**
 * @route PUT /api/v1/students-comedor/:id
 * @description Actualiza la información de un estudiante del comedor.
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const updateStudentComedor = async (req, res) => {
    const { id } = req.params;
    const { student_id, name, email, user_id } = req.body;

    try {
        const studentComedor = await StudentComedor.findByPk(id);
        if (!studentComedor) {
            return res.status(404).json({ message: 'Estudiante del comedor no encontrado.' });
        }

        // Si se intenta cambiar el user_id, verificar que el nuevo user_id no esté ya asociado a otro estudiante del comedor
        if (user_id && String(user_id) !== String(studentComedor.user_id)) {
            const existingStudentWithNewUserId = await StudentComedor.findOne({ where: { user_id } });
            if (existingStudentWithNewUserId) {
                return res.status(409).json({ message: 'El user_id proporcionado ya está asociado a otro estudiante del comedor.' });
            }
        }

        await studentComedor.update({
            student_id: student_id ?? studentComedor.student_id,
            name: name ?? studentComedor.name,
            email: email ?? studentComedor.email,
            user_id: user_id ?? studentComedor.user_id
        });

        res.status(200).json({ message: 'Estudiante del comedor actualizado exitosamente.', student: studentComedor.toJSON() });
    } catch (error) {
        console.error('[StudentComedorController] Error al actualizar estudiante del comedor:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar estudiante del comedor', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/students-comedor/:id
 * @description Elimina un estudiante del sistema del comedor.
 * @access Privado (Requiere rol: admin)
 */
export const deleteStudentComedor = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await StudentComedor.destroy({
            where: { id: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Estudiante del comedor no encontrado.' });
        }

        res.status(200).json({ message: 'Estudiante del comedor eliminado exitosamente.' });
    } catch (error) {
        console.error('[StudentComedorController] Error al eliminar estudiante del comedor:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar estudiante del comedor', error: error.message });
    }
};
