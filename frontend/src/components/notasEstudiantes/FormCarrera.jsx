import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormCarrera = () => {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [años, setAños] = useState(0);
  const [facultades, setFacultades] = useState([]);
  const [idFacultad, setIdFacultad] = useState(0);

  const [errorCarrera, setErrorCarrera] = useState("");
  const [errorAños, setErrorAños] = useState("");
  const [errorFacultad, setErrorFacultad] = useState("");

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchFacultades();
  }, []);

  const fetchFacultades = async () => {
    const response = await axios.get("http://localhost:3000/auth/facultades");
    setFacultades(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCarrera("");
    setErrorAños("");
    setErrorFacultad("");

    // Validar que los campos no estén vacíos
    if (nombreCarrera.trim() === "") {
      setErrorCarrera("Por favor, ingresa el nombre de la carrera.");
      return;
    }

    if (años <= 0 || años > 5) {
      setErrorAños("Por favor, ingresa un año válido (1-5).");
      return;
    }
    if (idFacultad === 0) {
      setErrorFacultad("Por favor, ingresa la facultad de la carrera.");
      return;
    }

    if (editing) {
      await axios.put(`http://localhost:3000/auth/carreras/${params.id}`, {
        id_facultad: idFacultad,
        nombre_carrera: nombreCarrera,
        años,
      });
    } else {
      try {
        const existe = await axios.get(
          `http://localhost:3000/auth/carreras/nombre/${nombreCarrera}`
        );
        if (existe.data.length > 0) {
          setErrorCarrera("la carrera ya existe");
          return;
        } else {
          await axios.post("http://localhost:3000/auth/carreras", {
            id_facultad: idFacultad,
            nombre_carrera: nombreCarrera,
            años,
          });
        }
      } catch (err) {
        console.error("Error al agregar la carrera:", err);
      }
    }
    setNombreCarrera("");
    setAños(0);
    setIdFacultad(0);
    setErrorCarrera("");
    setErrorAños("");
    setErrorFacultad("");
    navigate("/home/carreras");
  };

  const fetchCarrera = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/auth/carreras/${id}`
    );
    const data = response.data;

    setNombreCarrera(data[0].nombre_carrera);
    setIdFacultad(data[0].id_facultad);
    setAños(data[0].años);

    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      fetchCarrera(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h4>Carrera</h4>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${errorCarrera ? "is-invalid" : ""}`}
            placeholder="Nombre de la carrera"
            value={nombreCarrera}
            onChange={(e) => setNombreCarrera(e.target.value)}
          />
          {errorCarrera && (
            <div className="invalid-feedback">{errorCarrera}</div>
          )}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className={`form-control ${errorAños ? "is-invalid" : ""}`}
            placeholder="Años"
            value={años}
            max={5}
            onChange={(e) => setAños(e.target.value)}
          />
          {errorAños && <div className="invalid-feedback">{errorAños}</div>}
        </div>
        <div className="mb-3">
          <select
            value={idFacultad}
            className={`form-control ${errorFacultad ? "is-invalid" : ""}`}
            onChange={(e) => setIdFacultad(e.target.value)}
          >
            <option value={0}>Selecciona una facultad</option>
            {facultades.map((facultad) => (
              <option key={facultad.id_facultad} value={facultad.id_facultad}>
                {facultad.nombre_facultad}
              </option>
            ))}
          </select>
          {errorFacultad && (
            <div className="invalid-feedback">{errorFacultad}</div>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormCarrera;
