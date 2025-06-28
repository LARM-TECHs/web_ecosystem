import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormNotas = () => {
  const [año, setAño] = useState(0);
  const [valor, setValor] = useState(0);
  const [idAsignatura, setIdAsignatura] = useState(0);
  const [asignaturas, setAsignaturas] = useState([]);

  const [errorAsignatura, setErrorAsignatura] = useState("");
  const [errorAño, setErrorAño] = useState("");
  const [errorValor, setErrorValor] = useState("");

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchAsignaturas(params.idBrigada);
  }, [params.idBrigada]);

  const fetchAsignaturas = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/auth/asignaturas/brigada/brigada/${id}`
    );
    setAsignaturas(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorAsignatura("");
    setErrorAño("");
    setErrorValor("");

    // Validar que los campos no estén vacíos

    if (idAsignatura === 0) {
      setErrorAsignatura("Por favor, ingresa la assignatura de la nota.");
      return;
    }
    if (valor < 2 || valor > 5) {
      setErrorValor("Por favor, ingresa una nota válida.");
      return;
    }
    if (año <= 0) {
      setErrorAño("Por favor, ingresa el año de la nota.");
      return;
    }

    if (editing) {
      await axios.put(`http://localhost:3000/auth/notas/${params.idNota}`, {
        id_asignatura: idAsignatura,
        id_estudiante: params.idEstudiante,
        valor,
        año,
      });
    } else {
      try {
        const existe = await axios.get(
          `http://localhost:3000/auth/notas/${idAsignatura}/${params.idEstudiante}`
        );
        if (existe.data.length > 0) {
          setErrorAsignatura("la nota ya existe");
          return;
        } else {
          await axios.post("http://localhost:3000/auth/notas", {
            id_asignatura: idAsignatura,
            id_estudiante: params.idEstudiante,
            valor,
            año,
          });
        }
      } catch (err) {
        console.error("Error al agregar la brigada:", err);
      }
    }
    setIdAsignatura(0);
    setValor(0);
    setAño(0);
    navigate(
      `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}`
    );
  };

  const fetchNota = async (id) => {
    const response = await axios.get(`http://localhost:3000/auth/notas/${id}`);
    const data = response.data;

    setIdAsignatura(data[0].id_asignatura);
    setValor(data[0].valor);
    setAño(data[0].año);

    setEditing(true);
  };

  useEffect(() => {
    if (params.idNota) {
      fetchNota(params.idNota);
    }
  }, [params.idNota]);

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h4>Nota</h4>
        <div className="mb-3">
          <select
            value={idAsignatura}
            className={`form-control ${errorAsignatura ? "is-invalid" : ""}`}
            onChange={(e) => setIdAsignatura(e.target.value)}
          >
            <option value={0}>Selecciona una asignatura</option>
            {asignaturas.map((a) => (
              <option key={a.id_asignatura} value={a.id_asignatura}>
                {a.nombre_asignatura}
              </option>
            ))}
          </select>
          {errorAsignatura && (
            <div className="invalid-feedback">{errorAsignatura}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input
            type="number"
            className={`form-control ${errorValor ? "is-invalid" : ""}`}
            placeholder="Valor"
            value={valor}
            max={5}
            onChange={(e) => setValor(e.target.value)}
          />
          {errorValor && <div className="invalid-feedback">{errorValor}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Año</label>
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
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormNotas;
