"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
   
export default function Register() {
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });
  const [error, setError] = useState("");
  const router = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (userInfo.nombre.length < 4) {
      setError("El usuario debe tener al menos 4 caracteres.");
      return;
    }
    if (userInfo.correo.length < 4) {
      setError("El correo debe tener al menos 4 caracteres.");
      return;
    }
    if (userInfo.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3001/users/register', userInfo); // Cambia esta URL por la de tu backend
      console.log(response.data);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      router("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.message || "Error al registrar el usuario.");
      } else if (error.request) {
        setError("Error de conexión. Por favor, intenta más tarde.");
      } else {
        setError("Error desconocido: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Registrar Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="nombre">
              Usuario
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="w-full border rounded p-2"
              value={userInfo.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="correo">
              Correo
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="w-full border rounded p-2"
              value={userInfo.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="contraseña">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              className="w-full border rounded p-2"
              value={userInfo.contraseña}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Crear Cuenta
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}