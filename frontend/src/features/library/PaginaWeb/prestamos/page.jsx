"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';  // Importar Axios

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    book: '',               // Cambié 'libro' por 'book' para coincidir con el DTO
    loanDate: '',           // Cambié 'fechaPrestamo' por 'loanDate'
    returnDate: '',         // Cambié 'fechaDevolucion' por 'returnDate'
    availableCopies: 0,     // Cambié 'ejemplaresDisponibles' por 'availableCopies'
  });

  // Obtener los préstamos desde el backend
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/loans/mostrar');
        setPrestamos(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchPrestamos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPrestamo((prev) => ({ ...prev, [name]: value }));
  };

  const agregarPrestamo = async (e) => {
    e.preventDefault();

    // Asegúrate de convertir las fechas a formato Date y las copias a número entero
    const prestamoFormateado = {
      book: nuevoPrestamo.book,
      loanDate: new Date(nuevoPrestamo.loanDate),  // Convertimos a tipo Date
      returnDate: new Date(nuevoPrestamo.returnDate),  // Convertimos a tipo Date
      availableCopies: parseInt(nuevoPrestamo.availableCopies),  // Convertimos a número entero
    };

    try {
      const response = await axios.post('http://localhost:3001/loans/register', prestamoFormateado);

      if (response.status === 201) {
        setPrestamos((prev) => [...prev, response.data]); // Agregar préstamo al estado
        setNuevoPrestamo({ book: '', loanDate: '', returnDate: '', availableCopies: 0 }); // Limpiar formulario
      } else {
        console.error('Error al agregar el préstamo');
      }
    } catch (error) {
      console.error('Error al agregar el préstamo:', error);
    }
  };

  const eliminarPrestamo = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/loans/delete/${id}`);

      if (response.status === 204) {
        setPrestamos(prestamos.filter((prestamo) => prestamo.id !== id)); // Eliminar préstamo del estado
      } else {
        console.error('Error al eliminar el préstamo');
      }
    } catch (error) {
      console.error('Error al eliminar el préstamo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Préstamos</h1>

        {/* Listado de préstamos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Préstamos Actuales</h2>
          {prestamos.length ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Libro</th>
                  <th className="border border-gray-300 p-2">Fecha de Préstamo</th>
                  <th className="border border-gray-300 p-2">Fecha de Devolución</th>
                  <th className="border border-gray-300 p-2">Ejemplares Disponibles</th>
                  <th className="border border-gray-300 p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id}>
                    <td className="border border-gray-300 p-2">{prestamo.book}</td>
                    <td className="border border-gray-300 p-2">{prestamo.loanDate}</td>
                    <td className="border border-gray-300 p-2">{prestamo.returnDate}</td>
                    <td className="border border-gray-300 p-2">{prestamo.availableCopies}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => eliminarPrestamo(prestamo.id)}
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
            <p>No hay préstamos registrados.</p>
          )}
        </div>

        {/* Formulario para agregar préstamos */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Préstamo</h2>
          <form onSubmit={agregarPrestamo} className="grid gap-4">
            <div>
              <label className="block font-medium mb-2">Libro</label>
              <input
                type="text"
                name="book"
                value={nuevoPrestamo.book}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Fecha de Préstamo</label>
              <input
                type="date"
                name="loanDate"
                value={nuevoPrestamo.loanDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Fecha de Devolución</label>
              <input
                type="date"
                name="returnDate"
                value={nuevoPrestamo.returnDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Ejemplares Disponibles</label>
              <input
                type="number"
                name="availableCopies"
                value={nuevoPrestamo.availableCopies}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            >
              Agregar Préstamo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}