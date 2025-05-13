import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorCorreo("");
    setErrorContraseña("");

    if (email.trim() === "") {
      setErrorCorreo("Por favor, ingresa el correo");
      return;
    }

    if (password.trim() === "") {
      setErrorContraseña("Por favor, ingresa la contraseña");
      return;
    }

    if (!validateEmail(email)) {
      setErrorCorreo("Por favor ingrese un correo válido.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        const id = decodedToken.id;
        const estudiante = await axios.get(
          `http://localhost:3000/auth/estudiante/usuario/${id}`
        );
        const data = estudiante.data;
        navigate(`/home/${data[0].id_estudiante}`); // Redirigir a la página principal, cambiarle el nombre
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^s@]+@[^s@]+.[^s@]+$/;
    ///[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2.5}/; ///^[^s@]+@[^s@]+.[^s@]+$/ ;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div style={{ width: "300px" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorCorreo && <div>{errorCorreo}</div>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorContraseña && (
            <div>{errorContraseña}</div>
          )}
        </div>
        <button type="submit">
          Iniciar Sesión
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <Link to="/administrador">administrador</Link>  
    </div>
  );
};

export default Login;
