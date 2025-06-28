// comedor-service/controllers/staffController.js
import db from '../models/index.js'; // Importa el objeto db con todos los modelos
import { generateQrCodeDataURL } from '../utils/qrGenerator.js'; // Necesario para regenerar la imagen QR si solo se guarda el qr_code
import axios from 'axios'; // Para futuras interacciones con otros microservicios (ej. user-auth-service)
import dotenv from 'dotenv';

dotenv.config();

const Staff = db.Staff;
const QRCode = db.QRCode;
const StudentComedor = db.StudentComedor;
const Menu = db.Menu;

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:4000';

/**
 * @route POST /api/v1/staff-comedor
 * @description Registra un nuevo miembro del personal en el sistema del comedor.
 * Requiere que el user_id (si se proporciona) exista en el user-auth-service y tenga un rol compatible (admin, profesor, staff).
 * @access Privado (Requiere rol: admin)
 */
export const registerStaffComedor = async (req, res) => {
    const { staff_id, name, role, user_id } = req.body;

    try {
        // Validación básica de entrada
        if (!staff_id || !name) {
            return res.status(400).json({ message: 'El ID de personal y el nombre son requeridos.' });
        }

        // Si se proporciona un user_id, verificar que exista en el user-auth-service
        if (user_id) {
            try {
                const authServiceResponse = await axios.get(`${API_GATEWAY_URL}/auth/profile`, {
                    headers: {
                        'Authorization': req.headers.authorization // Reenviar el token JWT del admin
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    }
                });

                if (authServiceResponse.status !== 200 || !authServiceResponse.data || authServiceResponse.data.id !== parseInt(user_id, 10)) {
                    console.warn(`[StaffComedorController] User ID ${user_id} not found or mismatch with authenticated user ID.`);
                    return res.status(400).json({ message: 'El user_id proporcionado no es válido o no corresponde a un usuario existente.' });
                }

                // Puedes añadir validación de rol del usuario si solo ciertos roles pueden ser staff
                // if (!['admin', 'profesor', 'staff'].includes(authServiceResponse.data.rol)) {
                //     return res.status(400).json({ message: 'El user_id no tiene un rol permitido para ser personal.' });
                // }

            } catch (axiosError) {
                console.error(`[StaffComedorController] Error al verificar user_id con auth-service:`, axiosError.message);
                return res.status(500).json({ message: 'Error al verificar el usuario con el servicio de autenticación.', error: axiosError.message });
            }

            // Verificar si el user_id ya está asociado a otro miembro del personal o estudiante del comedor
            const existingStaffWithUserId = await Staff.findOne({ where: { user_id } });
            if (existingStaffWithUserId) {
                return res.status(409).json({ message: 'El user_id proporcionado ya está asociado a otro miembro del personal.' });
            }
            const existingStudentWithUserId = await StudentComedor.findOne({ where: { user_id } });
            if (existingStudentWithUserId) {
                return res.status(409).json({ message: 'El user_id proporcionado ya está asociado a un estudiante del comedor.' });
            }
        }

        const [staff, created] = await Staff.findOrCreate({
            where: { staff_id: staff_id },
            defaults: {
                name,
                role: role || 'staff_comedor', // Rol por defecto, asegurando consistencia con el auth
                user_id: user_id || null
            }
        });

        if (!created) {
            // Si el personal ya existía, puede que se esté intentando registrar de nuevo.
            // Aquí se actualizan sus datos si vienen en la petición
            console.log(`[StaffComedorController] Personal con staff_id ${staff_id} ya existe. Actualizando...`);
            await staff.update({
                name: name ?? staff.name,
                role: role ?? staff.role,
                user_id: user_id ?? staff.user_id
            });
            return res.status(200).json({ message: 'Personal del comedor ya existe y ha sido actualizado.', staff: staff.toJSON() });
        }

        res.status(201).json({ message: 'Personal del comedor registrado exitosamente.', staff: staff.toJSON() });

    } catch (error) {
        console.error('[StaffComedorController] Error al registrar personal del comedor:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar el personal del comedor', error: error.message });
    }
};

/**
 * @route GET /api/v1/staff-comedor
 * @description Obtiene todos los miembros del personal registrados.
 * @access Privado (Requiere rol: admin)
 */
export const getAllStaffComedor = async (req, res) => {
    try {
        const staffMembers = await Staff.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(staffMembers);
    } catch (error) {
        console.error('[StaffComedorController] Error al obtener todos los miembros del personal:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el personal', error: error.message });
    }
};

/**
 * @route GET /api/v1/staff-comedor/:id
 * @description Obtiene un miembro del personal por su ID interno.
 * @access Privado (Requiere rol: admin)
 */
export const getStaffComedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const staffMember = await Staff.findByPk(id);
        if (!staffMember) {
            return res.status(404).json({ message: 'Miembro del personal no encontrado.' });
        }
        res.status(200).json(staffMember.toJSON());
    } catch (error) {
        console.error('[StaffComedorController] Error al obtener miembro del personal por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el miembro del personal', error: error.message });
    }
};

/**
 * @route PUT /api/v1/staff-comedor/:id
 * @description Actualiza la información de un miembro del personal.
 * @access Privado (Requiere rol: admin)
 */
export const updateStaffComedor = async (req, res) => {
    const { id } = req.params;
    const { staff_id, name, role, user_id } = req.body;

    try {
        const staffMember = await Staff.findByPk(id);
        if (!staffMember) {
            return res.status(404).json({ message: 'Miembro del personal no encontrado.' });
        }

        // Si se intenta cambiar el user_id, verificar que el nuevo user_id no esté ya asociado a otro staff o estudiante
        if (user_id && String(user_id) !== String(staffMember.user_id)) {
            const existingStaffWithNewUserId = await Staff.findOne({ where: { user_id } });
            if (existingStaffWithNewUserId) {
                return res.status(409).json({ message: 'El user_id proporcionado ya está asociado a otro miembro del personal.' });
            }
            const existingStudentWithUserId = await StudentComedor.findOne({ where: { user_id } });
            if (existingStudentWithUserId) {
                return res.status(409).json({ message: 'El user_id proporcionado ya está asociado a un estudiante del comedor.' });
            }
        }

        await staffMember.update({
            staff_id: staff_id ?? staffMember.staff_id,
            name: name ?? staffMember.name,
            role: role ?? staffMember.role,
            user_id: user_id ?? staffMember.user_id
        });

        res.status(200).json({ message: 'Miembro del personal actualizado exitosamente.', staff: staffMember.toJSON() });
    } catch (error) {
        console.error('[StaffComedorController] Error al actualizar miembro del personal:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el miembro del personal', error: error.message });
    }
};

/**
 * @route DELETE /api/v1/staff-comedor/:id
 * @description Elimina un miembro del personal.
 * @access Privado (Requiere rol: admin)
 */
export const deleteStaffComedor = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Staff.destroy({
            where: { id: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Miembro del personal no encontrado.' });
        }

        res.status(200).json({ message: 'Miembro del personal eliminado exitosamente.' });
    } catch (error) {
        console.error('[StaffComedorController] Error al eliminar miembro del personal:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el miembro del personal', error: error.message });
    }
};

/**
 * @route POST /api/v1/staff-comedor/validate-qr
 * @description Permite al personal validar un código QR presentado por un estudiante.
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const validateQrCode = async (req, res) => {
    const { qrData } = req.body; // qrData es la cadena de texto incrustada en el QR
    const authenticatedUserId = req.user.id; // ID del staff que valida (para logging si es necesario)
    const authenticatedUserRole = req.user.rol;

    try {
        // Opcional: Verificar si el staff_id que realiza la validación existe y es válido
        // const staffRecord = await Staff.findOne({ where: { user_id: authenticatedUserId } });
        // if (!staffRecord) {
        //     return res.status(403).json({ message: 'Acceso denegado: Usuario no registrado como personal del comedor.' });
        // }

        if (!qrData) {
            return res.status(400).json({ message: 'Datos del código QR faltantes.' });
        }

        // Buscar el registro del QR code
        const qrRecord = await QRCode.findOne({
            where: {
                qr_code: qrData,
            },
            include: [{
                model: StudentComedor,
                as: 'studentComedor',
                attributes: ['student_id', 'name', 'email', 'user_id']
            }, {
                model: Menu,
                as: 'menu',
                attributes: ['menu_id', 'date', 'breakfast', 'lunch', 'dinner']
            }]
        });

        if (!qrRecord) {
            console.log('[Staff-QR-Validation] QR no encontrado.');
            return res.status(404).json({
                valid: false,
                message: 'Código QR inválido o no encontrado.'
            });
        }

        // Verificar si el QR ya ha sido usado
        if (qrRecord.used) {
            console.log('[Staff-QR-Validation] QR ya usado. QR ID:', qrRecord.qr_id);
            return res.status(400).json({
                valid: false,
                message: 'Este código QR ya ha sido utilizado para esta comida.'
            });
        }

        // Verificar que el QR sea del día actual
        const today = new Date().toISOString().split('T')[0];
        if (qrRecord.date !== today) {
            console.log(`[Staff-QR-Validation] QR expirado. Fecha QR: ${qrRecord.date}, Fecha actual: ${today}. QR ID: ${qrRecord.qr_id}`);
            return res.status(400).json({
                valid: false,
                message: 'Código QR expirado o no válido para el día de hoy.'
            });
        }

        // Marcar QR como usado
        await qrRecord.update({ used: true, used_at: new Date() });
        console.log(`[Staff-QR-Validation] QR marcado como usado. QR ID: ${qrRecord.qr_id}, StudentComedor ID: ${qrRecord.student_comedor_id}`);

        res.status(200).json({
            valid: true,
            message: 'Código QR válido. Acceso al comedor concedido.',
            qrDetails: {
                qrId: qrRecord.qr_id,
                studentComedorId: qrRecord.student_comedor_id,
                studentName: qrRecord.studentComedor?.name || 'Nombre no disponible',
                studentExternalId: qrRecord.studentComedor?.student_id || 'ID Externo no disponible',
                studentEmail: qrRecord.studentComedor?.email || 'Email no disponible',
                menuDate: qrRecord.menu?.date || qrRecord.date,
                mealDetails: {
                    breakfast: qrRecord.menu?.breakfast,
                    lunch: qrRecord.menu?.lunch,
                    dinner: qrRecord.menu?.dinner
                },
                usedAt: qrRecord.used_at
            }
        });

    } catch (error) {
        console.error('[StaffComedorController] Error validando QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al validar el código QR.', error: error.message });
    }
};

/**
 * @route GET /api/v1/staff-comedor/qr-history
 * @description Obtiene el historial de uso de códigos QR, con filtros opcionales por fecha y studentComedorId.
 * @access Privado (Requiere rol: admin, staff_comedor)
 * @queryParam {string} date - Filtra por fecha (YYYY-MM-DD).
 * @queryParam {string} studentComedorId - Filtra por el ID interno del estudiante del comedor.
 * @queryParam {boolean} used - Filtra por estado de uso (true/false).
 */
export const getQrHistory = async (req, res) => {
    const { date, studentComedorId, used } = req.query;
    const whereClause = {};

    try {
        if (date) {
            // Validar formato de fecha (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({ message: 'Formato de fecha inválido para el filtro. Use YYYY-MM-DD.' });
            }
            whereClause.date = date;
        }
        if (studentComedorId) {
            whereClause.student_comedor_id = studentComedorId;
        }
        if (used !== undefined) { // Check for undefined specifically, as 'false' is a valid boolean
            whereClause.used = (used === 'true'); // Convert string 'true'/'false' to boolean
        }

        const qrHistory = await QRCode.findAll({
            where: whereClause,
            include: [{
                model: StudentComedor,
                as: 'studentComedor',
                attributes: ['student_id', 'name', 'email']
            }, {
                model: Menu,
                as: 'menu',
                attributes: ['menu_id', 'date', 'breakfast', 'lunch', 'dinner']
            }],
            order: [['created_at', 'DESC']], // Ordenar por fecha de creación del QR
            limit: 100 // Limitar resultados para no sobrecargar
        });

        res.status(200).json(qrHistory);
    } catch (error) {
        console.error('[StaffComedorController] Error obteniendo historial de QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial de QR.', error: error.message });
    }
};

/**
 * @route GET /api/v1/staff-comedor/qrcodes/:qrId
 * @description Obtiene los detalles de un QR específico, incluyendo si ya fue usado.
 * @access Privado (Requiere rol: admin, staff_comedor)
 */
export const getQrCodeDetails = async (req, res) => {
    const { qrId } = req.params;

    try {
        const qrRecord = await QRCode.findByPk(qrId, {
            include: [{
                model: StudentComedor,
                as: 'studentComedor',
                attributes: ['student_id', 'name', 'email', 'user_id']
            }, {
                model: Menu,
                as: 'menu',
                attributes: ['menu_id', 'date', 'breakfast', 'lunch', 'dinner']
            }]
        });

        if (!qrRecord) {
            return res.status(404).json({ message: 'Código QR no encontrado.' });
        }

        // Si se necesita la imagen QR en Data URL (base64) para visualización
        const qrCodeDataURL = await generateQrCodeDataURL(qrRecord.qr_code);

        res.status(200).json({
            ...qrRecord.toJSON(),
            qrCodeImage: qrCodeDataURL // Añade la imagen QR en base64 a la respuesta
        });

    } catch (error) {
        console.error('[StaffComedorController] Error obteniendo detalles del QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener detalles del QR.', error: error.message });
    }
};
