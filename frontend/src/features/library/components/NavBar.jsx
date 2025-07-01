import { Link } from 'react-router-dom'; 
import '../styles/NavBar.css';
export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center">
    
      <div className="flex items-center space-x-2">
        <img 
          src="/unnamed.png"  
          alt="Logo Universidad de las Tunas"
          className="h-10 w-auto" 
        />
        <span className="text-lg font-bold">Biblioteca ULT</span>
      </div>

    
      <ul className="flex space-x-6 ml-auto">
  <li>
    <Link to="/" className="hover:text-gray-400">
      Inicio
    </Link>
  </li>
  <li>
    <Link to="/catalogo" className="hover:text-gray-400">
      Catálogo
    </Link>
  </li>
  <li>
    <Link to="/seleccion" className="hover:text-gray-400">
      Selección
    </Link>
  </li>
  <li>
    <Link to="/prestamos" className="hover:text-gray-400">
      Préstamos
    </Link>
  </li>
  <li>
    <Link to="/RegistrarLibro" className="hover:text-gray-400">
      Registrar Libro
    </Link>
  </li>
</ul>
    </nav>
  );
}