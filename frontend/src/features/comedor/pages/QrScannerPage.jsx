import React, { useState, useEffect } from 'react';
import Scanner from '../components/Scanner';
import { apiService } from '../api/apiService';

const QRScanner = () => {
    const [currentView, setCurrentView] = useState('scanner'); // 'scanner', 'history', 'students'
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrHistory, setQrHistory] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Función para validar QR
    const handleQRScan = async (qrData) => {
        if (!qrData) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.post('/comedor/staff/validate-qr', {
                qrData: qrData,
                staffId: 'STAFF001' // Aquí deberías usar el ID del staff autenticado
            });

            if (response.data.valid) {
                setValidationResult(response.data);
                setSuccess(`✅ QR válido para ${response.data.studentName}`);
                // Actualizar historial después de validación exitosa
                await fetchQRHistory();
            } else {
                setError(`❌ ${response.data.message}`);
                setValidationResult(null);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al validar QR';
            setError(`❌ ${errorMessage}`);
            setValidationResult(null);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener historial de QR
    const fetchQRHistory = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await apiService.get(`/comedor/staff/qr-history?date=${today}`);
            setQrHistory(response.data);
        } catch (err) {
            console.error('Error obteniendo historial:', err);
        }
    };

    // Función para obtener lista de estudiantes
    const fetchStudents = async () => {
        try {
            const response = await apiService.get('/comedor/staff/students');
            setStudents(response.data);
        } catch (err) {
            console.error('Error obteniendo estudiantes:', err);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        if (currentView === 'history') {
            fetchQRHistory();
        } else if (currentView === 'students') {
            fetchStudents();
        }
    }, [currentView]);

    // Limpiar mensajes después de 5 segundos
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const renderScanner = () => (
        <div className="scanner-container">
            <h2>Escáner de QR - Comedor</h2>

            {/* Mensajes de estado */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Loader */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Validando QR...</p>
                </div>
            )}

            {/* Scanner */}
            <div className="scanner-wrapper">
                <Scanner onScanSuccess={handleQRScan} />
            </div>

            {/* Resultado de validación */}
            {validationResult && (
                <div className="validation-result">
                    <h3>✅ QR Válido</h3>
                    <div className="student-info">
                        <p><strong>Estudiante:</strong> {validationResult.studentName}</p>
                        <p><strong>ID:</strong> {validationResult.studentId}</p>
                        <p><strong>Fecha:</strong> {validationResult.date}</p>
                        <p><strong>Menú ID:</strong> {validationResult.menu_id}</p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="history-container">
            <h2>Historial de QR - Hoy</h2>
            <button
                className="btn btn-primary"
                onClick={fetchQRHistory}
            >
                🔄 Actualizar
            </button>

            <div className="history-list">
                {qrHistory.length === 0 ? (
                    <p>No hay registros para hoy</p>
                ) : (
                    qrHistory.map((record, index) => (
                        <div key={index} className="history-item">
                            <div className="student-name">
                                {record.student?.name || 'Estudiante no encontrado'}
                            </div>
                            <div className="student-id">ID: {record.student_id}</div>
                            <div className="status">
                                {record.used ? '✅ Usado' : '⏳ Pendiente'}
                            </div>
                            <div className="timestamp">
                                {new Date(record.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="students-container">
            <h2>Lista de Estudiantes</h2>
            <button
                className="btn btn-primary"
                onClick={fetchStudents}
            >
                🔄 Actualizar
            </button>

            <div className="students-list">
                {students.length === 0 ? (
                    <p>No hay estudiantes registrados</p>
                ) : (
                    students.map((student, index) => (
                        <div key={index} className="student-item">
                            <div className="student-name">{student.name}</div>
                            <div className="student-id">ID: {student.student_id}</div>
                            <div className="student-email">{student.email}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="comedor-qr-page">
            {/* Navegación */}
            <nav className="nav-tabs">
                <button
                    className={`nav-tab ${currentView === 'scanner' ? 'active' : ''}`}
                    onClick={() => setCurrentView('scanner')}
                >
                    📷 Scanner
                </button>
                <button
                    className={`nav-tab ${currentView === 'history' ? 'active' : ''}`}
                    onClick={() => setCurrentView('history')}
                >
                    📋 Historial
                </button>
                <button
                    className={`nav-tab ${currentView === 'students' ? 'active' : ''}`}
                    onClick={() => setCurrentView('students')}
                >
                    👥 Estudiantes
                </button>
            </nav>

            {/* Contenido */}
            <div className="page-content">
                {currentView === 'scanner' && renderScanner()}
                {currentView === 'history' && renderHistory()}
                {currentView === 'students' && renderStudents()}
            </div>
        </div>
    );
};

export default QRScanner;