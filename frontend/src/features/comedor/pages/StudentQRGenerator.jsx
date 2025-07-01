import { useState } from "react";
import { apiService } from "../api/apiService";

function StudentQRGenerator() {
    const [qrCode, setQrCode] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateQR = async (e) => {
        e.preventDefault();

        if (!studentId.trim()) {
            setError('Por favor ingresa tu ID de estudiante');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await apiService.generateStudentQR(studentId);
            setQrCode(data.qrCode);
        } catch (err) {
            setError('Error generando código QR. Verifica tu ID de estudiante.');
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Generar Mi Código QR</h2>

            <form onSubmit={generateQR} style={{
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
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
                        required
                    />
                </div>

                <button
                    type="submit"
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
            </form>

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

            {qrCode && (
                <div style={{
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '5px'
                }}>
                    <h3>Tu código QR para hoy:</h3>
                    <img
                        src={qrCode}
                        alt="Código QR del estudiante"
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: 'white',
                            padding: '10px',
                            maxWidth: '300px'
                        }}
                    />
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                        Presenta este código en el comedor para ingresar
                    </p>
                </div>
            )}
        </div>
    );
}

export default StudentQRGenerator;