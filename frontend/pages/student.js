import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '../utils/api';

export default function Student() {
  const [studentId, setStudentId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const data = await apiService.getTodayMenu();
      setMenu(data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const generateQR = async () => {
    if (!studentId.trim()) {
      setError('Por favor ingresa tu ID de estudiante');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiService.generateQR(studentId);
      setQrCode(data.qrCode);
    } catch (err) {
      setError('Error generando código QR. Verifica tu ID de estudiante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        ← Volver al inicio
      </Link>
      
      <h1>Portal del Estudiante</h1>

      {/* Sección del código QR */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        marginBottom: '30px', 
        borderRadius: '5px' 
      }}>
        <h2>Obtener Código QR</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="studentId">ID de Estudiante:</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Ingresa tu ID de estudiante"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '3px'
            }}
          />
        </div>
        <button
          onClick={generateQR}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generando...' : 'Generar Código QR'}
        </button>

        {error && (
          <div style={{ 
            color: 'red', 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '3px'
          }}>
            {error}
          </div>
        )}

        {qrCode && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>Tu código QR para hoy:</h3>
            <img 
              src={qrCode} 
              alt="Código QR"
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                padding: '10px'
              }}
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Presenta este código en el comedor
            </p>
          </div>
        )}
      </div>

      {/* Sección del menú */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '5px' 
      }}>
        <h2>Menú del Día</h2>
        {menu ? (
          <div>
            <p><strong>Fecha:</strong> {menu.date}</p>
            <div style={{ marginTop: '15px' }}>
              <h3>Desayuno</h3>
              <p style={{ marginLeft: '20px' }}>{menu.breakfast || 'No disponible'}</p>
              
              <h3>Almuerzo</h3>
              <p style={{ marginLeft: '20px' }}>{menu.lunch || 'No disponible'}</p>
              
              <h3>Cena</h3>
              <p style={{ marginLeft: '20px' }}>{menu.dinner || 'No disponible'}</p>
            </div>
          </div>
        ) : (
          <p>Cargando menú...</p>
        )}
      </div>
    </div>
  );
}