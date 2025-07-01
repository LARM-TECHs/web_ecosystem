"use client"
import { useState,useEffect } from 'react';
import axios from 'axios';
import Table from './table'; // Componente para la tabla
import BookForm from './bookForm'; // Componente para el formulario

export default function Seleccion() {
  const [seleccion, setSeleccion] = useState([
    {
      id: 1,
      book: 'Historia Universal',
      author: 'asdas',
      publisher: 'afa',
      quantity: 3,
    },
  ]);

  const [nuevoLibro, setNuevoLibro] = useState({
    
    book: '',
    author: '',
    publisher: '',
    quantity: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro((prev) => ({ ...prev, [name]: value }));
  }; 


  // Función para obtener los libros desde el backend
  const obtenerLibros = async () => {
    try {
      const response = await axios.get('http://localhost:3001/selection/mostrar'); // Endpoint del backend
      console.log(response.data);
      setSeleccion(response.data); // Guardamos los libros en el estado
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  useEffect(() => {
    obtenerLibros(); // Cargar los libros cuando el componente se monta
  }, []);


  const agregarLibro = async (e) => {
    e.preventDefault();
    setSeleccion([...seleccion, { ...nuevoLibro }]);

    const response = await axios.post("http://localhost:3001/selection/register", nuevoLibro);
    setNuevoLibro({ book: '', author: '', publisher: '', quantity: 0 });
  };

  const eliminarLibro = async (id) => {
    setSeleccion(seleccion.filter((nuevoLibro) => nuevoLibro.id !== id));
    await axios.delete(`http://localhost:3001/selection/delete/${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Seleccion de libros para comprar</h1>

        {/* Listado de libros */}
        <Table seleccion={seleccion} eliminarLibro={eliminarLibro} />

        {/* Formulario para agregar libros */}
        <BookForm 
          nuevoLibro={nuevoLibro} 
          handleChange={handleChange} 
          agregarLibro={agregarLibro} 
        />
      </div>
    </div>
  );
}
