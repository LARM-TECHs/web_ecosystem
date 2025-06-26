import { useState } from "react";
import Scanner from '../components/Scanner';

function QRScanner() {
  const [result, setResult] = useState("");

  const handleScan = (e) => {
    e.preventDefault();
    // Simulación de escaneo QR
    const qr = prompt("Pega aquí el contenido del QR");
    if (qr) {
      setResult(qr);
    }
  };

  return (
    <div>
      <h2>Escanear QR del Estudiante</h2>
      <button onClick={handleScan}>Simular Escaneo</button>
      <div>Contenido del QR: {result}</div>
    </div>
  );
}

export default Scanner;
