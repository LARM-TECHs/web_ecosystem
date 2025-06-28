// comedor-service/controllers/qrCodeController.js
import { generateQrRawData, generateQrCodeDataURL } from '../utils/qrGenerator.js'; // Importa las funciones de utilidad
import db from '../models/index.js';  // Importa el objeto db con todos los modelos

const Menu = db.Menu;
const QRCode = db.QRCode;
const StudentComedor = db.StudentComedor; // Importa el modelo StudentComedor

/**
 * @route GET /api/v1/students/:studentComedorId/qr
 * @description Genera o recupera un código QR para un estudiante para el menú del día actual.
 * Si no hay menú para hoy, crea uno por defecto.
 * @access Privado (Requiere rol: estudiante, o admin/staff si el ID de estudiante coincide con el usuario del token)
 * @param {string} req.params.studentComedorId - El ID interno del estudiante del comedor (desde StudentComedor.id).
 */
export const generateOrGetStudentQRCode = async (req, res) => {
    const authenticatedUserId = req.user.id;
    const authenticatedUserRole = req.user.rol;
    const studentComedorIdFromParams = req.params.studentComedorId;

    try {
        const studentComedorRecord = await StudentComedor.findByPk(studentComedorIdFromParams);

        if (!studentComedorRecord) {
            return res.status(404).json({ message: 'Estudiante del comedor no encontrado.' });
        }

        if (authenticatedUserRole !== 'admin' && authenticatedUserRole !== 'staff_comedor') {
            if (String(studentComedorRecord.user_id) !== String(authenticatedUserId)) {
                return res.status(403).json({ message: 'Acceso denegado: No tiene permiso para generar/obtener QR para este estudiante.' });
            }
        }

        const today = new Date().toISOString().split('T')[0];

        console.log(`[QR-Controller] Generando/Obteniendo QR para student_comedor_id: ${studentComedorIdFromParams}, fecha: ${today}`);

        let currentMenu = await Menu.findOne({ where: { date: today } });

        if (!currentMenu) {
            console.log(`[QR-Controller] No hay menú para hoy (${today}), creando uno por defecto.`);
            currentMenu = await Menu.create({
                date: today,
                breakfast: 'Desayuno no disponible',
                lunch: 'Almuerzo no disponible',
                dinner: 'Cena no disponible'
            });
            console.log('[QR-Controller] Menú por defecto creado:', currentMenu.toJSON());
        } else {
            console.log('[QR-Controller] Menú existente para hoy:', currentMenu.toJSON());
        }

        let qrRecord = await QRCode.findOne({
            where: {
                student_comedor_id: studentComedorIdFromParams,
                date: today,
                menu_id: currentMenu.menu_id
            }
        });

        let qrCodeDataURL;

        if (!qrRecord) {
            console.log(`[QR-Controller] Creando nuevo QR para student_comedor_id: ${studentComedorIdFromParams}.`);

            // Usar la función de utilidad para generar los datos brutos del QR
            const qrRawData = generateQrRawData(studentComedorRecord.student_id, today);

            // Usar la función de utilidad para generar la imagen del QR
            qrCodeDataURL = await generateQrCodeDataURL(qrRawData);

            qrRecord = await QRCode.create({
                student_comedor_id: studentComedorIdFromParams,
                menu_id: currentMenu.menu_id,
                qr_code: qrRawData,
                date: today,
                used: false
            });
            console.log('[QR-Controller] Nuevo registro QR creado:', qrRecord.toJSON());
        } else {
            console.log('[QR-Controller] QR existente encontrado:', qrRecord.toJSON());
            // Si ya existe, regenerar la imagen QR desde los datos guardados
            qrCodeDataURL = await generateQrCodeDataURL(qrRecord.qr_code);
        }

        res.status(200).json({
            qrCode: qrCodeDataURL,
            qrId: qrRecord.qr_id,
            menuId: currentMenu.menu_id,
            date: today,
            used: qrRecord.used,
            studentComedorId: qrRecord.student_comedor_id
        });

    } catch (error) {
        console.error('[QR-Controller] Error generando/obteniendo QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al generar o recuperar el código QR.', error: error.message });
    }
};
