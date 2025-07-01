'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import axios from 'axios';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const router = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const users = await axios.post('http://localhost:3001/users/login', {
      nombre,
      contraseña,
    });

    
   

    if (users) {
      
      localStorage.setItem('access_token', users.data.access_token);
     // localStorage.setItem('isAuthenticated', 'true');
      router.push('/'); 
    } else {
       setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div   style={{ backgroundImage: "url('/login.webp')" }} className="min-h-screen bg-cover bg-center">

<div className="login-container">
      <form onSubmit={handleSubmit} className="formulario">
        <div className="userDiv">
          <img
            src="/usuario.jpg" 
            alt="Usuario"
            className="user"
          />
          <h1>Bienvenido</h1>
        </div>

        <div className="nombre">
          <input
            className="n"
            placeholder="Ingresa tu nombre"
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="p"
            placeholder="Ingresa tu contraseña"
            id="contraseña"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar sesión</button>

      
        <div className="extra-links">
          <a href="/RegistroUsuario" className="link">
            ¿No tienes cuenta? Regístrate
          </a>
          <a href="/recuperar" className="link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
    </div>
   
  );
}