import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

function QRScanner() {
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
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            width: '200px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {!isScanning ? (
          <button
            onClick={startScanning}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📷 Iniciar Escáner
          </button>
        ) : (
          <button
            onClick={stopScanning}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏹️ Detener Escáner
          </button>
        )}
      </div>

      {/* Video element para el escáner */}
      {isScanning && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <video
            id="qr-video"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '375px',
              border: '2px solid #007bff',
              borderRadius: '10px',
              backgroundColor: '#000'
            }}
          />
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '10px',
            fontStyle: 'italic'
          }}>
            📱 Apunta la cámara hacia el código QR del estudiante
          </p>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div style={{
          color: '#721c24',
          padding: '12px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Mostrar resultado del escaneo */}
      {scanResult && (
        <div style={{
          padding: '20px',
          border: '2px solid ' + (scanResult.valid ? '#28a745' : '#dc3545'),
          borderRadius: '10px',
          backgroundColor: scanResult.valid ? '#d4edda' : '#f8d7da'
        }}>
          <h3>Resultado del Escaneo:</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <strong>Estado:</strong> {scanResult.valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}
          </p>
          <p><strong>Mensaje:</strong> {scanResult.message}</p>
          {scanResult.valid && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '5px' }}>
              <p><strong>👤 ID Estudiante:</strong> {scanResult.studentId}</p>
              <p><strong>📝 Nombre:</strong> {scanResult.studentName}</p>
              <p><strong>📅 Fecha:</strong> {scanResult.date}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QRScanner;