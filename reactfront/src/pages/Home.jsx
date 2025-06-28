function Home() {
  return (
    <div>
      <h2>Bienvenido al Sistema del Comedor Universitario</h2>
      <div style={{ marginTop: '30px' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          <h3>Para Estudiantes:</h3>
          <ul>
            <li><strong>Ver Menú:</strong> Consulta el menú diario del comedor</li>
            <li><strong>Mi Código QR:</strong> Genera tu código QR para acceder al comedor</li>
          </ul>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '5px' 
        }}>
          <h3>Para Personal del Comedor:</h3>
          <ul>
            <li><strong>Gestión Menús:</strong> Crear, editar y eliminar menús diarios</li>
            <li><strong>Escáner QR:</strong> Validar códigos QR de estudiantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
