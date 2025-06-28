// scripts/testQr.js
import { generateQrRawData, generateQrCodeDataURL } from '../utils/qrGenerator.js';
import fs from 'fs';

async function testQr() {
    const studentId = 'STU001';
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // 1) Genera la cadena “bruta”
    const raw = generateQrRawData(studentId, date);
    console.log('🔹 Raw QR data:', raw);

    // 2) Genera el Data URL del QR
    try {
        const qrDataUrl = await generateQrCodeDataURL(raw);
        console.log('🔹 QR Data URL (base64):\n', qrDataUrl);
        // Opcional: grábalo en un fichero para verlo en el navegador
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync('qr-test.png', base64Data, 'base64');
        console.log('✅ Imagen QR guardada como qr-test.png');
    } catch (err) {
        console.error('❌ Error al generar QR:', err);
    }
}

testQr();
