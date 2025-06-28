import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const FormAsigCarrera = () => {
  const [idAsignatura, setIdAsignatura] = useState(0);
  const [asignaturas, setAsignaturas] = useState([]);

  const [errorAsignatura, setErrorAsignatura] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  const fetchAsignaturas = async () => {
    const response = await axios.get("http://localhost:3000/auth/asignaturas");
    setAsignaturas(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorAsignatura("");

    // Validar que los campos no estén vacíos

    if (idAsignatura === 0) {
      setErrorAsignatura("Por favor, ingresa una asignatura.");
      return;
    }

    const existe = await axios.get(
      `http://localhost:3000/auth/asignaturas/${params.id}/${idAsignatura}`
    );
    if (existe.data.length > 0) {
      setErrorAsignatura("la asignatura ya existe");
      return;
    } else {
      try {
        await axios.post("http://localhost:3000/auth/asignaturas/carrera", {
          id_asignatura: idAsignatura,
          id_carrera: params.id,
        });
      } catch (err) {
        console.error("Error al agregar la asignatura:", err);
      }

      setIdAsignatura(0);
      navigate(`/home/carreras/asignaturas/${params.id}`);
    }
  };

  return (
    <>
      <Layout />
      <div className="container mx-auto p-2" style={{ width: "300px" }}>
        <h4>Asignatura</h4>
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
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </>
  );
};

export default FormAsigCarrera;
