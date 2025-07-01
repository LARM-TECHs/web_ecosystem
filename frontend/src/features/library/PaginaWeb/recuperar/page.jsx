'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [error, setError] = useState('');
  const router = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const users = JSON.parse(localStorage.getItem('users')) || [];

    
    const foundUser = users.find(
      (user) => user.username === usernameOrEmail || user.email === usernameOrEmail
    );

    if (foundUser) {
      
      localStorage.setItem('usernameForReset', foundUser.username);
    
      router('/nuevaCon');
    } else {
      setError('Usuario o correo no encontrado.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="usernameOrEmail">
              Nombre de Usuario o Correo Electrónico
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="w-full border rounded p-2"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Buscar Cuenta
          </button>
        </form>
      </div>
    </div>
  );
}