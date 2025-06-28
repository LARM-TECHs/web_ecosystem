import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormEstudiantes = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [carnet, setCarnet] = useState("");
  const [brigadas, setBrigadas] = useState([]);
  const [idBrigada, setIdBrigada] = useState(0);

  const [errorNombre, setErrorNombre] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");
  const [errorCarnet, setErrorCarnet] = useState("");
  const [errorBrigada, setErrorBrigada] = useState("");

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchBrigadas();
  }, []);

  const fetchBrigadas = async () => {
    const response = await axios.get("http://localhost:3000/auth/brigadas");
    setBrigadas(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorNombre("");
    setErrorCarnet("");
    setErrorCorreo("");
    setErrorContraseña("");
    setErrorBrigada("");

    // Validar que los campos no estén vacíos
    if (nombre.trim() === "") {
      setErrorNombre("Por favor, ingresa el nombre del estudiante.");
      return;
    }

    if (carnet.trim() === "") {
      setErrorCarnet("Por favor, ingresa el carnet del estudiante.");
      return;
    }
    if (carnet.length != 11){
      setErrorCarnet("Por favor, ingresa bien el carnet (11 dígitos)")
    }

    if (idBrigada === 0) {
      setErrorBrigada("Por favor, ingresa la brigada del estudiante.");
      return;
    }

    if (correo.trim() === "") {
      setErrorCorreo("Por favor, ingresa el correo del estudiante.");
      return;
    }

    if (contraseña.trim() === "") {
      setErrorContraseña("Por favor, ingresa la contraseña del estudiante.");
      return;
    }

    if (!validateEmail(correo)) {
      setErrorCorreo("Por favor ingrese un correo válido.");
      return;
    }
    if (editing) {
      await axios.put(`http://localhost:3000/auth/estudiantes/${params.id}`, {
        correo,
        contraseña,
        id_brigada: idBrigada,
        nombre_estudiante: nombre,
        carnet,
      });
    } else {
      try {
        const existe = await axios.get(
          `http://localhost:3000/auth/estudiantes/correo/${correo}`
        );
        if (existe.data.length > 0) {
          setErrorCorreo("el correo ya esta en uso");
          return;
        } else {
          await axios.post("http://localhost:3000/auth/estudiantes", {
            correo,
            contraseña,
            id_brigada: idBrigada,
            nombre_estudiante: nombre,
            carnet,
          });
        }
        
      } catch (err) {
        console.error("Error al agregar el estudiante:", err);
      }
    }

      
      setNombre("");
      setCorreo("");
      setContraseña("");
      setCarnet("");
      setIdBrigada(0);

      navigate("/home/estudiantes");

  };

  const validateEmail = (email) => {
    const re = /^[^s@]+@[^s@]+.[^s@]+$/;
    ///[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2.5}/; ///^[^s@]+@[^s@]+.[^s@]+$/ ;
    return re.test(String(email).toLowerCase());
  };

  const fetchEstudiante = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/auth/estudiantes/${id}`
    );
    const data = response.data;

    setNombre(data[0].nombre_estudiante);
    setCorreo(data[0].correo);
    setContraseña("");
    setCarnet(data[0].carnet);
    setIdBrigada(data[0].id_brigada);

    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      fetchEstudiante(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h4>Estudiante</h4>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${errorNombre ? "is-invalid" : ""}`}
            placeholder="Nombre y Apellidos"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errorNombre && <div className="invalid-feedback">{errorNombre}</div>}
        </div>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${errorCarnet ? "is-invalid" : ""}`}
            placeholder="Carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
          />
          {errorCarnet && <div className="invalid-feedback">{errorCarnet}</div>}
        </div>
        <div className="mb-3">
          <select
            value={idBrigada}
            className={`form-control ${errorBrigada ? "is-invalid" : ""}`}
            onChange={(e) => setIdBrigada(e.target.value)}
          >
            <option value={0}>Selecciona una brigada</option>
            {brigadas.map((b) => (
              <option key={b.id_brigada} value={b.id_brigada}>
                {b.nombre_brigada}
              </option>
            ))}
          </select>
          {errorBrigada && (
            <div className="invalid-feedback">{errorBrigada}</div>
          )}
        </div>
        <div className="mb-3">
          <input
            type="email"
            className={`form-control ${errorCorreo ? "is-invalid" : ""}`}
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errorCorreo && <div className="invalid-feedback">{errorCorreo}</div>}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className={`form-control ${errorContraseña ? "is-invalid" : ""}`}
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          {errorContraseña && (
            <div className="invalid-feedback">{errorContraseña}</div>
          )}
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormEstudiantes;
