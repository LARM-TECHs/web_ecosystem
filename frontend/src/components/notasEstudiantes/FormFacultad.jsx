import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormAsignatura = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (nombre.trim() === "") {
      setError("Por favor, ingresa el nombre de la facultad.");
      return;
    }

    if (editing) {
      await axios.put(`http://localhost:3000/auth/facultades/${params.id}`, {
        nombre,
      });
    } else {
      try {
        const existe = await axios.get(
          `http://localhost:3000/auth/facultades/nombre/${nombre}`
        );
        if (existe.data.length > 0) {
          setError("la facultad ya existe");
          return;
        } else {
          await axios.post("http://localhost:3000/auth/facultades", { nombre });
        }
      } catch (err) {
        console.error("Error al agregar la facultad", err);
      }
    }
    setNombre("");
    setError("");
    navigate("/home/facultades");
  };

  const fetchFacultad = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/auth/facultades/${id}`
    );
    const data = response.data;
    setNombre(data[0].nombre_facultad);
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      fetchFacultad(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h1>Facultad</h1>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la facultad"
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormAsignatura;
