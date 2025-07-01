import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const Scanner = ({ onScanSuccess, onScanError }) => {
    // QR States
    const scanner = useRef();
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);
    const [scannedResult, setScannedResult] = useState("");
    const [isScanning, setIsScanning] = useState(true);

    // Success handler
    const handleScanSuccess = (result) => {
        console.log('QR Escaneado:', result);
        setScannedResult(result?.data);

        // Pausar el scanner brevemente para evitar múltiples scans
        setIsScanning(false);
        scanner.current?.pause();

        // Llamar al callback del componente padre
        if (onScanSuccess) {
            onScanSuccess(result?.data);
        }

        // Reanudar el scanner después de 3 segundos
        setTimeout(() => {
            setIsScanning(true);
            setScannedResult("");
            scanner.current?.start();
        }, 3000);
    };

    // Fail handler
    const handleScanFail = (err) => {
        console.log('Error de scan:', err);
        if (onScanError) {
            onScanError(err);
        }
    };

    // Initialize scanner
    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            // Instantiate the QR Scanner
            scanner.current = new QrScanner(
                videoEl.current,
                handleScanSuccess,
                {
                    onDecodeError: handleScanFail,
                    preferredCamera: "environment",
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    overlay: qrBoxEl?.current || undefined,
                    maxScansPerSecond: 2, // Limitar scans por segundo
                }
            );

            // Start QR Scanner
            scanner.current
                .start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    console.error('Error iniciando scanner:', err);
                    if (err) setQrOn(false);
                });
        }

        // Cleanup on unmount
        return () => {
            if (scanner?.current) {
                scanner.current.stop();
                scanner.current.destroy();
                scanner.current = null;
            }
        };
    }, []);

    // Camera permission alert
    useEffect(() => {
        if (!qrOn) {
            alert(
                "Cámara bloqueada o no accesible. Por favor permite el acceso a la cámara en los permisos del navegador y recarga la página."
            );
        }
    }, [qrOn]);

    // Manual restart function
    const restartScanner = () => {
        setScannedResult("");
        setIsScanning(true);
        if (scanner.current) {
            scanner.current.start();
        }
    };

    // Stop scanner manually
    const stopScanner = () => {
        setIsScanning(false);
        if (scanner.current) {
            scanner.current.pause();
        }
    };

    return (
        <div className="qr-reader">
            {/* Scanner Controls */}
            <div className="scanner-controls">
                <button
                    className={`control-btn ${isScanning ? 'stop' : 'start'}`}
                    onClick={isScanning ? stopScanner : restartScanner}
                >
                    {isScanning ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
                <button
                    className="control-btn restart"
                    onClick={restartScanner}
                >
                    🔄 Reiniciar
                </button>
            </div>

            {/* Video element */}
            <video ref={videoEl} className="qr-video"></video>

            {/* QR Box overlay */}
            <div ref={qrBoxEl} className="qr-box">
                <div className="qr-frame">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                </div>

                {/* Instructions */}
                <div className="scan-instructions">
                    <p>Coloca el código QR dentro del marco</p>
                    {!isScanning && <p className="paused-text">Scanner pausado</p>}
                </div>
            </div>

            {/* Status indicator */}
            <div className={`status-indicator ${qrOn ? 'active' : 'inactive'}`}>
                <div className="status-dot"></div>
                <span>{qrOn ? (isScanning ? 'Escaneando...' : 'Pausado') : 'Cámara no disponible'}</span>
            </div>

            {/* Scanned result display */}
            {scannedResult && (
                <div className="scan-result">
                    <div className="result-header">
                        <h3>✅ QR Escaneado</h3>
                        <button
                            className="close-result"
                            onClick={() => setScannedResult("")}
                        >
                            ✕
                        </button>
                    </div>
                    <p className="result-data">{scannedResult}</p>
                    <div className="result-actions">
                        <button
                            className="btn btn-primary"
                            onClick={restartScanner}
                        >
                            Escanear otro
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;