import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sistema de Comedor Universitario</h1>
      <div style={{ marginTop: '30px' }}>
        <h2>Selecciona tu tipo de usuario:</h2>
        <div style={{ marginTop: '20px' }}>
          <Link href="/student" style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            margin: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            Estudiante
          </Link>
          <Link href="/admin" style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            margin: '10px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            Administrador
          </Link>
        </div>
      </div>
    </div>
  );
}