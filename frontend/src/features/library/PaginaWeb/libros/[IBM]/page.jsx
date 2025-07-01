"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetalleLibro() {
  const { IBM } = useParams(); 
  const [libro, setLibro] = useState(null);

  useEffect(() => {
    if (IBM) {
    const librosGuardados = JSON.parse(localStorage.getItem("catalogo")) || [];
    const libroEncontrado = librosGuardados.find((libro) => libro.IBM === IBM);
    setLibro(libroEncontrado); 
  }
}, [IBM]); 

  if (!libro) return <p>Cargando...</p>; 

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800">
      <header className="p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold">{libro.titulo}</h1>
      </header>

      <main className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Detalles del Libro</h2>
          <p><strong>Título:</strong> {libro.titulo}</p>
          <p><strong>Autor:</strong> {libro.autor}</p>
          <p><strong>IBM:</strong> {libro.IBM}</p>
          <p><strong>Clasificación:</strong> {libro.Clasificación}</p>
          <p><strong>Año:</strong> {libro.Año}</p>
          <p><strong>Fecha de Publicación:</strong> {libro.fechaPublicacion}</p>
          {/* Mostrar la ubicación solo si el libro es físico */}
          {libro.tipo === "fisico" && (
            <div className="mt-4">
              <p><strong>Ubicación en la Biblioteca:</strong> {libro.ubicacion}</p>
            </div>
          )}

          {/* Mostrar enlace de descarga solo si el libro es digital */}
          {libro.tipo === "digital" && (
            <div className="mt-4">
              <p>
                <strong>Enlace de Descarga:</strong>{" "}
                <a
                  href={libro.enlaceDescarga}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Descargar
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}