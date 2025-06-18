import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormBrigadas = () => {
  const [nombre, setNombre] = useState("");
  const [año, setAño] = useState(0);
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setIdCarrera] = useState(0);

  const [errorBrigada, setErrorBrigada] = useState("");
  const [errorAño, setErrorAño] = useState("");
  const [errorCarrera, setErrorCarrera] = useState("");

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchCarreras();
  }, []);

  const fetchCarreras = async () => {
    const response = await axios.get("http://localhost:3000/auth/carreras");
    setCarreras(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBrigada("");
    setErrorCarrera("");
    setErrorAño("");
    // Validar que los campos no estén vacíos
    if (nombre.trim() === "") {
      setErrorBrigada("Por favor, ingresa el nombre de la brigada.");
      return;
    }
    if (año <= 0 || año > 5) {
      setErrorAño("Por favor, ingresa un año válido.");
      return;
    }
    if (idCarrera === 0) {
      setErrorCarrera("Por favor, ingresa la carrera de la brigada.");
      return;
    }

    const carrera = carreras.filter((c) => c.id_carrera === idCarrera);

  

    if (editing) {
      
      await axios.put(`http://localhost:3000/auth/brigadas/${params.id}`, {
        id_carrera: idCarrera,
        nombre_brigada: nombre,
        año_brigada: año,
        añoFinal_brigada: carrera[0].años,
      });
    } else {
      try {
        const existe = await axios.get(
          `http://localhost:3000/auth/brigadas/nombre/${nombre}`
        );
        if (existe.data.length > 0) {
          setErrorCarrera("la brigada ya existe");
          return;
        } else {
          await axios.post("http://localhost:3000/auth/brigadas", {
            id_carrera: idCarrera,
            nombre_brigada: nombre,
            año_brigada: año,
            añoFinal_brigada: carrera[0].años,
          });
        }
      } catch (err) {
        console.error("Error al agregar la brigada:", err);
      }
    }
    setNombre("");
    setAño(0);
    setIdCarrera(0);
    setErrorCarrera("");
    setErrorAño("");
    setErrorBrigada("");
    navigate("/home/brigadas");
  };

  const fetchBrigada = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/auth/brigadas/${id}`
    );
    const data = response.data;

    setNombre(data[0].nombre_brigada);
    setIdCarrera(data[0].id_carrera);
    setAño(data[0].año_brigada);

    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      fetchBrigada(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h4>Brigada</h4>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${errorBrigada ? "is-invalid" : ""}`}
            placeholder="Nombre de la brigada"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errorBrigada && (
            <div className="invalid-feedback">{errorBrigada}</div>
          )}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${errorAño ? "is-invalid" : ""}`}
            placeholder="Año"
            value={año}
            max={5}
            onChange={(e) => setAño(e.target.value)}
          />
          {errorAño && <div className="invalid-feedback">{errorAño}</div>}
        </div>
        <div className="mb-3">
          <select
            value={idCarrera}
            className={`form-control ${errorCarrera ? "is-invalid" : ""}`}
            onChange={(e) => setIdCarrera(e.target.value)}
          >
            <option value={0}>Selecciona una carrera</option>
            {carreras.map((c) => (
              <option key={c.id_carrera} value={c.id_carrera}>
                {c.nombre_carrera}
              </option>
            ))}
          </select>
          {errorCarrera && (
            <div className="invalid-feedback">{errorCarrera}</div>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormBrigadas;
