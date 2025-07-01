// components/Libro.js
import { Link } from "react-router-dom";

export default function Libro({ libro, eliminarLibro, tipo }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <Link href={`/${tipo === "fisico" ? "libros" : "digital"}/${libro.id}`} passHref>
        <div className="cursor-pointer">
          <h3 className="font-bold">{libro.titulo}</h3>
          <p className="text-sm text-gray-600">Autor: {libro.author || libro.autor}</p>
          {libro.location && <p className="text-sm text-gray-600">Ubicación: {libro.location}</p>}
        </div>
      </Link>

      {tipo === "digital" && (
        <p className="mt-2">
          <a
            href={libro.enlaceDescarga}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Descargar
          </a>
        </p>
      )}

      <button
        onClick={() => eliminarLibro(libro.id || libro.ibm)}
        className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Eliminar
      </button>
    </div>
  );
}
