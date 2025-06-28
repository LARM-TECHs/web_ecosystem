// comedor-service/utils/qrGenerator.js
import QRCodeGenerator from 'qrcode'; // Librería para generar códigos QR
import crypto from 'crypto';          // Módulo nativo de Node.js para generar bytes aleatorios

/**
 * Genera una cadena de datos única para incrustar en un código QR.
 * Combina el ID del estudiante, la fecha y un hash aleatorio para asegurar unicidad y seguridad.
 * @param {string} studentId - El ID del estudiante (ej. student_id de StudentComedor o notas-estudiantes).
 * @param {string} date - La fecha en formato YYYY-MM-DD.
 * @returns {string} Una cadena de datos única.
 */
export const generateQrRawData = (studentId, date) => {
    // Generar un hash aleatorio para asegurar que cada QR sea único, incluso si studentId y date se repiten
    // Esto es CRUCIAL para evitar que un mismo estudiante use el mismo QR para el mismo día múltiples veces
    // si el QR no es marcado como usado inmediatamente o si hay reintentos.
    const uniqueHash = crypto.randomBytes(16).toString('hex'); // 16 bytes = 32 caracteres hexadecimales
    return `${studentId}-${date}-${uniqueHash}`;
};

/**
 * Convierte una cadena de datos brutos en un Data URL de imagen QR (base64).
 * @param {string} qrRawData - La cadena de datos que se incrustará en el QR.
 * @returns {Promise<string>} Una promesa que resuelve con el Data URL del código QR.
 */
export const generateQrCodeDataURL = async (qrRawData) => {
    try {
        const qrCodeImage = await QRCodeGenerator.toDataURL(qrRawData, {
            errorCorrectionLevel: 'H', // Alto nivel de corrección de errores
            type: 'image/png',         // Formato de imagen
            quality: 0.92,             // Calidad de la imagen
            margin: 1,                 // Margen alrededor del QR
            color: {
                dark: "#000000",        // Color de los módulos oscuros
                light: "#FFFFFF"        // Color de los módulos claros (fondo)
            }
        });
        return qrCodeImage;
    } catch (error) {
        console.error('Error al generar la imagen QR:', error);
        throw new Error('No se pudo generar la imagen del código QR.');
    }
};
