import { Link } from "react-router-dom";

function Home() {
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    margin: "10px",
    width: "300px",
    textAlign: "center"
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "10px 20px",
    margin: "10px 5px",
    borderRadius: "5px",
    textDecoration: "none",
    color: "white"
  };

  return (
    <div>
      <h2>Bienvenido al Sistema del Comedor Universitario</h2>
      <p>Selecciona tu tipo de usuario para continuar:</p>
      
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "30px" }}>
        <div style={cardStyle}>
          <h3>👨‍🎓 Estudiante</h3>
          <p>Consulta el menú del día y genera tu código QR para acceder al comedor.</p>
          <div>
            <Link 
              to="/student/menu" 
              style={{...buttonStyle, backgroundColor: "#17a2b8"}}
            >
              Ver Menú
            </Link>
            <Link 
              to="/student/qrcode" 
              style={{...buttonStyle, backgroundColor: "#007bff"}}
            >
              Mi Código QR
            </Link>
          </div>
        </div>

        <div style={cardStyle}>
          <h3>👨‍💼 Personal del Comedor</h3>
          <p>Gestiona los menús diarios y escanea códigos QR de los estudiantes.</p>
          <div>
            <Link 
              to="/staff/menu" 
              style={{...buttonStyle, backgroundColor: "#28a745"}}
            >
              Gestionar Menús
            </Link>
            <Link 
              to="/staff/scan" 
              style={{...buttonStyle, backgroundColor: "#dc3545"}}
            >
              Escanear QR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;