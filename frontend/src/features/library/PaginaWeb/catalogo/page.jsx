"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '/styles/catalogo'; // Puedes personalizar el estilo

const CatalogoLibros = () => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Función para obtener los libros desde el backend
  const obtenerLibros = async () => {
    try {
      const response = await axios.get('http://localhost:3001/books/mostrar'); // Endpoint del backend
      console.log(response.data);
      setLibros(response.data); // Guardamos los libros en el estado
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  // Filtrar libros según el término de búsqueda
  const filtrarLibros = (libros, searchTerm) => {
    if (!searchTerm) return libros; // Si no hay término de búsqueda, mostrar todos los libros
    return libros.filter((libro) => 
      libro.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      libro.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    obtenerLibros(); // Cargar los libros cuando el componente se monta
  }, []);

  // Función para manejar el clic en un libro
  const manejarClickLibro = (libro) => {
    setLibroSeleccionado(libro); // Al hacer clic, mostramos los detalles del libro
  };

  const manejarEliminarLibro = async (id) => {
    try {
      // Hacer la solicitud DELETE al backend
      await axios.delete(`http://localhost:3001/books/delete/${id}`);
      
      // Filtrar el libro que vamos a eliminar en el frontend
      const librosActualizados = libros.filter((libro) => libro.id !== id);
  
      // Actualizar el estado de los libros con los libros restantes
      setLibros(librosActualizados);
  
      // Limpiar el libro seleccionado
      setLibroSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      alert("Hubo un error al eliminar el libro.");
    }
  };

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  return (
    <div className={styles.container}>
      <h1>Catálogo de Libros</h1>

      {/* Barra de búsqueda */}
<div className="mt-6 flex items-center space-x-2 justify-center">
  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Buscar libros por Titulo o Autor"
      value={searchTerm}
      onChange={handleSearchChange} // Actualiza el término de búsqueda
      className="px-6 py-3 pl-12 w-full rounded-lg text-white bg-blue-500 border-2 border-blue-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white transition duration-200 ease-in-out"
    />
    {/* Icono de lupa */}
    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl">
      🔍
    </span>
  </div>
</div>


      {/* Mostrar los libros físicos */}
      <h2>Libros Físicos</h2>
      <div className={styles.catalogo}>
        {filtrarLibros(libros, searchTerm) // Filtrar los libros por el término de búsqueda
          .filter((libro) => libro.type === 'fisico') // Filtramos solo los libros físicos
          .map((libro) => (
            <div
              key={libro.id}  // Asegúrate de que 'id' sea único y esté disponible
              className={styles.card}
              onClick={() => manejarClickLibro(libro)}
            >
              <h3>{libro.title}</h3>
              <p>{libro.author}</p>
              <p>{libro.publicationDate}</p>
            </div>
          ))}
      </div>

      {/* Mostrar los libros digitales */}
      <h2>Libros Digitales</h2>
      <div className={styles.catalogo}>
        {filtrarLibros(libros, searchTerm) // Filtrar los libros por el término de búsqueda
          .filter((libro) => libro.type === 'digital')
          .map((libro) => (
            <div
              key={libro.id}
              className={styles.card}
              onClick={() => manejarClickLibro(libro)}
            >
              <h3>{libro.title}</h3>
              <p>{libro.author}</p>
              <p>{libro.publicationDate}</p>
            </div>
          ))}
      </div>

      {/* Mostrar detalles del libro seleccionado */}
      {libroSeleccionado && (
        <div className={styles.detalleLibro}>
          <h2>Detalles del Libro</h2>
          <p><strong>Título:</strong> {libroSeleccionado.title}</p>
          <p><strong>Autor:</strong> {libroSeleccionado.author}</p>
          <p><strong>Clasificación:</strong> {libroSeleccionado.classification}</p>
          <p><strong>Fecha de Publicación:</strong> {libroSeleccionado.publicationDate}</p>
          <p><strong>Cantidad de Copias:</strong> {libroSeleccionado.copies}</p>
          <p><strong>Ubicación:</strong> {libroSeleccionado.location}</p>

          {/* Botón para deseleccionar */}
          <button
            className={styles.botonDeseleccionar}
            onClick={() => setLibroSeleccionado(null)} // Al hacer clic, deselecciona el libro
          >
            Quitar Detalles
          </button>

          {/* Botón para eliminar el libro */}
          <button
            className={styles.botonEliminar}
            onClick={() => manejarEliminarLibro(libroSeleccionado.id)} // Llamamos a la función de eliminar
          >
            Eliminar Libro
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogoLibros;
