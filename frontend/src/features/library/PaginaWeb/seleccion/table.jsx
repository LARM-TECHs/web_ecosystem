export default function Table({ seleccion, eliminarLibro }) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Libros</h2>
        {seleccion.length ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Libro</th>
                <th className="border border-gray-300 p-2">Autor</th>
                <th className="border border-gray-300 p-2">Editorial</th>
                <th className="border border-gray-300 p-2">Cantidad</th>
                <th className="border border-gray-300 p-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {seleccion.map((seleccion) => (
                <tr key={seleccion.id}>
                  <td className="border border-gray-300 p-2">{seleccion.book}</td>
                  <td className="border border-gray-300 p-2">{seleccion.author}</td>
                  <td className="border border-gray-300 p-2">{seleccion.publisher}</td>
                  <td className="border border-gray-300 p-2">{seleccion.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => eliminarLibro(seleccion.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay libros registrados.</p>
        )}
      </div>
    );
  }