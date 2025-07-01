"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/catalogo.css'; // Puedes personalizar el estilo

const CatalogoLibros = () => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // Función para obtener los libros desde el backend
  const obtenerLibros = async () => {
    try {
      const response = await axios.get('http://localhost:3001/Mostrar'); // Endpoint del backend
      setLibros(response.data); // Guardamos los libros en el estado
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  useEffect(() => {
    obtenerLibros(); // Cargar los libros cuando el componente se monta
  }, []);

  // Función para manejar el clic en un libro
  const manejarClickLibro = (libro) => {
    setLibroSeleccionado(libro); // Al hacer clic, mostramos los detalles del libro
  };

  return (
    <div className="container">
      <h1>Catálogo de Libros</h1>

      {/* Mostrar los libros físicos */}
      <h2>Libros Físicos</h2>
      <div className="catalogo">
        {libros
          .filter((libro) => libro.type === 'físico')
          .map((libro) => (
            <div
              key={libro.id}
              className="card"
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
      <div className='catalogo'>
        {libros
          .filter((libro) => libro.type === 'digital')
          .map((libro) => (
            <div
              key={libro.id}
              className="card"
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
        <div className="detalleLibro">
          <h2>Detalles del Libro</h2>
          <p><strong>Título:</strong> {libroSeleccionado.title}</p>
          <p><strong>Autor:</strong> {libroSeleccionado.author}</p>
          <p><strong>Clasificación:</strong> {libroSeleccionado.classification}</p>
          <p><strong>Fecha de Publicación:</strong> {libroSeleccionado.publicationDate}</p>
          <p><strong>Cantidad de Copias:</strong> {libroSeleccionado.copies}</p>
          <p><strong>Ubicación:</strong> {libroSeleccionado.location}</p>
        </div>
      )}
    </div>
  );
};

export default CatalogoLibros;