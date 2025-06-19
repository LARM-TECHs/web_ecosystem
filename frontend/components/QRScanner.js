import { useState, useEffect } from 'react';
import { apiService } from '../utils/api';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [staffId, setStaffId] = useState('STAFF001');
  const [error, setError] = useState('');

  useEffect(() => {
    let qrScanner = null;

    const startScanner = async () => {
      try {
        // Importar QrScanner dinámicamente
        const QrScanner = (await import('qr-scanner')).default;
        
        const videoElement = document.getElementById('qr-video');
        if (!videoElement) return;

        qrScanner = new QrScanner(
          videoElement,
          (result) => {
            console.log('QR detectado:', result.data);
            handleQRScan(result.data);
            qrScanner.stop();
            setIsScanning(false);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await qrScanner.start();
      } catch (err) {
        console.error('Error iniciando escáner:', err);
        setError('Error accediendo a la cámara: ' + err.message);
        setIsScanning(false);
      }
    };

    if (isScanning) {
      startScanner();
    }

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [isScanning]);

  const handleQRScan = async (qrData) => {
    try {
      const data = await apiService.validateQR(qrData, staffId);
      setScanResult(data);
      setError('');
    } catch (err) {
      setError('Error validando código QR');
      console.error('Error:', err);
    }
  };

  const startScanning = () => {
    setScanResult(null);
    setError('');
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div>
      <h2>Escáner de Códigos QR</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="staffId">ID del Personal:</label>
        <input
          id="staffId"
          type="text"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          style={{
            marginLeft: '10px',
            padding: '5px',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {!isScanning ? (
          <button
            onClick={startScanning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Iniciar Escáner
          </button>
        ) : (
          <button
            onClick={stopScanning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Detener Escáner
          </button>
        )}
      </div>

      {/* Video element para el escáner */}
      {isScanning && (
        <div style={{ marginBottom: '20px' }}>
          <video
            id="qr-video"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '375px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
            Apunta la cámara hacia el código QR
          </p>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div style={{
          color: 'red',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          borderRadius: '3px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Mostrar resultado del escaneo */}
      {scanResult && (
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: scanResult.valid ? '#e6ffe6' : '#ffe6e6'
        }}>
          <h3>Resultado del Escaneo:</h3>
          <p><strong>Estado:</strong> {scanResult.valid ? '✅ Válido' : '❌ Inválido'}</p>
          <p><strong>Mensaje:</strong> {scanResult.message}</p>
          {scanResult.valid && (
            <>
              <p><strong>ID Estudiante:</strong> {scanResult.studentId}</p>
              <p><strong>Nombre:</strong> {scanResult.studentName}</p>
              <p><strong>Fecha:</strong> {scanResult.date}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}