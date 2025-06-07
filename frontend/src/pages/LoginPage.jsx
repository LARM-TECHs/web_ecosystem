// src/pages/Login.jsx
import React, { useState } from 'react';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/LoginPage.css"
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña

  const handleLogin = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    console.log('Credenciales:', { email, password });
    // Aquí puedes añadir lógica para la autenticación
  }

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Imagen de fondo" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Bienvenido!</h2>
            <p>Por favor completa los datos</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ?
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} /> :
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                }
              </div>

  
              <div className="login-center-buttons">
                <button type="submit">Iniciar sesión</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
