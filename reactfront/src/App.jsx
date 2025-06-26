import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import StaffMenu from "./pages/StaffMenu";
import QRScanner from "./pages/QRScanner";
import StudentMenu from "./pages/StudentMenu";
import StudentQRGenerator from "./pages/StudentQRGenerator";

function App() {
  const navStyle = {
    display: "flex", 
    gap: "1rem", 
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px"
  };

  const linkStyle = {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "3px"
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Sistema de Comedor Universitario</h1>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/staff/menu" style={{...linkStyle, backgroundColor: "#28a745"}}>Staff - Menús</Link>
        <Link to="/staff/scan" style={{...linkStyle, backgroundColor: "#28a745"}}>Staff - Escanear QR</Link>
        <Link to="/student/menu" style={{...linkStyle, backgroundColor: "#17a2b8"}}>Estudiante - Ver Menú</Link>
        <Link to="/student/qrcode" style={{...linkStyle, backgroundColor: "#17a2b8"}}>Estudiante - Mi QR</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff/menu" element={<StaffMenu />} />
        <Route path="/staff/scan" element={<QRScanner />} />
        <Route path="/student/menu" element={<StudentMenu />} />
        <Route path="/student/qrcode" element={<StudentQRGenerator />} />
      </Routes>
    </div>
  );
}

export default App;
