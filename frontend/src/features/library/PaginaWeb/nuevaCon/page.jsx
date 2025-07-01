'use client';

import { useState } from 'react';
import { useRouter } from 'react-router-dom';

export default function ForgotPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setSuccess('');
      return;
    }

    // Recuperar usuarios desde localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const username = localStorage.getItem('usernameForReset'); // Suponiendo que guardamos el nombre de usuario temporalmente
    const user = users.find((user) => user.username === username);

    if (user) {
      // Actualizar la contraseña del usuario
      user.password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess('Contraseña actualizada con éxito');
      setError('');
      router.push('/login'); // Redirigir a login
    } else {
      setError('Usuario no encontrado');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Restablecer Contraseña</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="newPassword">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="w-full border rounded p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full border rounded p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Restablecer Contraseña
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿Recuerdas tu contraseña?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}