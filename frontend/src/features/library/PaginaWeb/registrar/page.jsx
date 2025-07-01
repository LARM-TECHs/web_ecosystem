"use client"; 

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function RegistrarLibro() {
  const [nuevoLibro, setNuevoLibro] = useState({
    title: "",
    author: "",
    classification: "",
    publicationDate: "",
    copies: 0,
    type: "fisico",
    location: "",
    enlaceDescarga: "",
  });

  const [error, setError] = useState(""); // Estado para manejar errores
  const router = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro({ ...nuevoLibro, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar si el libro ya existe en el localStorage (opcional)
      const librosExistentes = JSON.parse(localStorage.getItem("catalogo")) || [];
      const libroExistente = librosExistentes.find((libro) => libro.classification === nuevoLibro.classification);

      if (libroExistente) {
        setError("Este libro ya está registrado.");
        return;
      }

      // Si no hay errores, hacer la solicitud POST al backend
    
      
      const response = await axios.post("http://localhost:3001/books/register", nuevoLibro);

      if (response.status === 201) { // Suponiendo que el backend devuelve un 201 al crear un libro
        alert("¡Libro registrado exitosamente!");
        router("/catalogo");
      }
    } catch (error) {
      console.error("Error al registrar el libro:", error);
      setError("Ocurrió un error al registrar el libro. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800">
      <header className="p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold">Registrar Libro</h1>
      </header>

      <main className="p-6">
        <form
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-500 mb-4">{error}</p>} {/* Mostrar error si existe */}

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="title">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full border rounded p-2"
              value={nuevoLibro.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="author">
              Autor
            </label>
            <input
              type="text"
              id="author"
              name="author"
              className="w-full border rounded p-2"
              value={nuevoLibro.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="classification">
              Clasificación
            </label>
            <input
              type="text"
              id="classification"
              name="classification"
              className="w-full border rounded p-2"
              value={nuevoLibro.classification}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="publicationDate">
              Fecha de Publicación
            </label>
            <input
              type="date"
              id="publicationDate"
              name="publicationDate"
              className="w-full border rounded p-2"
              value={nuevoLibro.publicationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="type">
              Tipo de Libro
            </label>
            <select


id="type"
              name="type"
              className="w-full border rounded p-2"
              value={nuevoLibro.type}
              onChange={handleChange}
            >
              <option value="fisico">Físico</option>
              <option value="digital">Digital</option>
            </select>
          </div>

          {nuevoLibro.type === "fisico" && (
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="location">
                Ubicación en la Biblioteca
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full border rounded p-2"
                value={nuevoLibro.location}
                onChange={handleChange}
              />
            </div>
          )}

          {nuevoLibro.type === "digital" && (
           <div className="mb-4">
           <label className="block font-medium mb-2" htmlFor="location">
             Enlace de Descarga
           </label>
           <input
             type="text"
             id="location"
             name="location"
             className="w-full border rounded p-2"
             value={nuevoLibro.location}
             onChange={handleChange}
           />
         </div>
       )}

          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="copies">
              Cantidad de Ejemplares
            </label>
            <input
              type="number"
              id="copies"
              name="copies"
              className="w-full border rounded p-2"
              value={nuevoLibro.copies}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Registrar Libro
          </button>
        </form>
      </main>
    </div>
  );
}