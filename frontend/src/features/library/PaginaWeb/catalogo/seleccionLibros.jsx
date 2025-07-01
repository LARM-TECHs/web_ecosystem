// components/SeccionLibros.js
import Libro from "./libro";

export default function SeccionLibros({ libros, tipo, eliminarLibro }) {
  const librosFiltrados = libros.filter((libro) => libro.tipo === tipo);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {tipo === "fisico" ? "Libros Físicos" : "Libros Digitales"}
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {librosFiltrados.length > 0 ? (
          librosFiltrados.map((libro) => (
            <Libro
              key={libro.id || libro.ibm}
              libro={libro}
              eliminarLibro={eliminarLibro}
              tipo={tipo}
            />
          ))
        ) : (
          <p className="text-gray-500">
            {tipo === "fisico"
              ? "No hay libros físicos disponibles."
              : "No hay libros digitales disponibles."}
          </p>
        )}
      </div>
    </section>
  );
}
