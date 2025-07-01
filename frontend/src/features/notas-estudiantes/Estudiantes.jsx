import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrigadas = async () => {
      const response = await axios.get("http://localhost:3000/auth/brigadas");
      setBrigadas(response.data);
    };

    fetchBrigadas();
  }, []);

  useEffect(() => {
    // Obtener estudiantes según la brigada seleccionada
    const fetchEstudiantes = async () => {
      const url = selectedBrigada
        ? `http://localhost:3000/auth/estudiantes/brigada/${selectedBrigada}`
        : "http://localhost:3000/auth/estudiantes";
      const response = await axios.get(url);
      setEstudiantes(response.data);
    };

    fetchEstudiantes();
  }, [selectedBrigada]);

  // Función para eliminar un estudiantes
  const eliminarEstudiante = async (id) => {
    await axios.delete(`http://localhost:3000/auth/estudiantes/${id} `);
    setEstudiantes(estudiantes.filter((e) => e.id_estudiante !== id));
  };

  return (
    <>
      <Layout />
      <div className="container">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn mb-5 mr-5"
            onClick={() => navigate("/home/estudiantes/new")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </button>
        </div>

        <div className="d-inline-block">
          <select
            onChange={(e) => setSelectedBrigada(e.target.value)}
            value={selectedBrigada}
            className="form-select"
          >
            <option value="">Todas las Brigadas</option>
            {brigadas.map((b) => (
              <option key={b.id_brigada} value={b.id_brigada}>
                {b.nombre_brigada}
              </option>
            ))}
          </select>
        </div>

        <table className="table caption-top">
          <caption>Lista de estudiantes</caption>
          <thead>
            <tr>
              <th scope="col">Nombre Y Apellidos</th>
              <th scope="col">Carnet</th>
              <th scope="col">Correo</th>
              <th scope="col" colSpan="2">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {estudiantes.map((e) => (
              <tr key={e.id_estudiante}>
                <td>{e.nombre_estudiante}</td>
                <td>{e.carnet}</td>
                <td>{e.correo}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-5"
                    onClick={() =>
                      navigate(
                        `/home/estudiantes/notas/${e.id_brigada}/${e.id_estudiante}`
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-card-list"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                      <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                    </svg>
                  </button>
                </td>
                <td className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn mr-5"
                    onClick={() =>
                      navigate(`/home/estudiantes/${e.id_estudiante}/editar`)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => eliminarEstudiante(e.id_estudiante)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Estudiantes;
