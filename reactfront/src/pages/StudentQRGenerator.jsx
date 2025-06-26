import { useState } from "react";
import { apiService } from "../api/axios";

function StudentQRGenerator() {
  const [qrCode, setQrCode] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!studentId.trim()) {
      setError('Por favor ingresa tu ID de estudiante');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await apiService.getStudentQR(studentId);
      setQrCode(data);
    } catch (err) {
      console.error("Error:", err);
      setError('Error generando código QR. Verifica tu ID de estudiante.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "3px",
    marginBottom: "15px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: loading ? "#ccc" : "#007bff",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: loading ? "not-allowed" : "pointer"
  };

  return (
    <div>
      <h2>Generar Mi Código QR</h2>
      <p>Ingresa tu ID de estudiante para generar tu código QR diario</p>
      
      <div style={{ maxWidth: "400px", margin: "20px 0" }}>
        <label htmlFor="student-id">ID de Estudiante:</label>
        <input
          id="student-id"
          type="text"
          placeholder="Ej: EST001, 12345678"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={inputStyle}
        />
        
        <button
          onClick={generateQR}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Generando..." : "Generar Código QR"}
        </button>
      </div>

      {error && (
        <div style={{
          color: "red",
          padding: "10px",
          backgroundColor: "#ffe6e6",
          borderRadius: "3px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      {qrCode && (
        <div style={{
          textAlign: "center",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa"
        }}>
          <h3>Tu Código QR para hoy ({qrCode.date})</h3>
          <img 
            src={qrCode.qrCode} 
            alt="Código QR del estudiante"
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "white",
              padding: "10px",
              maxWidth: "300px"
            }}
          />
          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
            📱 Presenta este código en el comedor<br/>
            ⏰ Válido solo para hoy<br/>
            🔄 Se puede usar una sola vez
          </p>
        </div>
      )}

      <div style={{
        marginTop: "30px",
        padding: "15px",
        backgroundColor: "#e7f3ff",
        borderRadius: "5px",
        border: "1px solid #b3d7ff"
      }}>
        <h4>ℹ️ Información importante:</h4>
        <ul style={{ textAlign: "left" }}>
          <li>El código QR se genera automáticamente para el día actual</li>
          <li>Cada código QR solo se puede usar una vez</li>
          <li>Si ya generaste un código hoy, se mostrará el mismo</li>
          <li>El código expira al final del día</li>
        </ul>
      </div>
    </div>
  );
}

export default StudentQRGenerator;
