import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const navigate = useNavigate();

  // Función para obtener las asignaturas
  const fetchAsignaturas = async () => {
    const response = await axios.get("http://localhost:3000/auth/asignaturas");
    setAsignaturas(response.data);
  };

  // Función para eliminar una asignatura
  const eliminarAsignatura = async (id) => {
    await axios.delete(`http://localhost:3000/auth/asignaturas/${id} `);
    setAsignaturas(asignaturas.filter((asig) => asig.id_asignatura !== id));
  };

  // Efecto para cargar las asignaturas al montar el componente
  useEffect(() => {
    fetchAsignaturas();
  }, []);

  return (
    <>
      <Layout />

      <div className="container">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn mb-5 mr-5"
            onClick={() => navigate("/home/asignaturas/new")}
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

        <table className="table caption-top">
          <caption>Lista de Asignaturas</caption>
          <thead>
            <tr>
              <th scope="col" colSpan="2">
                Asignaturas
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {asignaturas.map((asig) => (
              <tr key={asig.id_asignatura}>
                <td>{asig.nombre_asignatura}</td>
                <td className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn mr-5"
                    onClick={() =>
                      navigate(`/home/asignaturas/${asig.id_asignatura}/editar`)
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
                    onClick={() => eliminarAsignatura(asig.id_asignatura)}
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

export default Asignaturas;
