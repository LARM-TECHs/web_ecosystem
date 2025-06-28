import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  
  const linkStyle = (path) => ({
    padding: '10px 15px',
    margin: '0 5px',
    backgroundColor: location.pathname === path ? '#007bff' : '#f8f9fa',
    color: location.pathname === path ? 'white' : '#333',
    textDecoration: 'none',
    borderRadius: '5px',
    border: '1px solid #ddd',
    display: 'inline-block'
  });

  return (
    <nav style={{ 
      borderBottom: '2px solid #ddd', 
      paddingBottom: '15px',
      marginBottom: '20px'
    }}>
      <h1 style={{ margin: '0 0 15px 0' }}>Sistema de Comedor Universitario</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <Link to="/" style={linkStyle('/')}>Inicio</Link>
        <Link to="/student/menu" style={linkStyle('/student/menu')}>Ver Menú</Link>
        <Link to="/student/qrcode" style={linkStyle('/student/qrcode')}>Mi Código QR</Link>
        <Link to="/staff/menu" style={linkStyle('/staff/menu')}>Gestión Menús</Link>
        <Link to="/staff/scan" style={linkStyle('/staff/scan')}>Escáner QR</Link>
      </div>
    </nav>
  );
}

export default Navigation;