import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/notasEstudiantes/Layout";
import { useNavigate, useParams } from "react-router-dom";

const Notas = () => {
  const [añoBrigada, setAñoBrigada] = useState([]);
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState('');
  const [selectedAño, setSelectedAño] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // Obtener promedio
    const fetchPromedio = async () => {
      const response = await axios.get(
        `http://localhost:3000/auth/notas/promedio/promedio/${params.idEstudiante}`
      );
      setPromedio(response.data[0].round);
    };

    fetchPromedio();
  }, [params.idEstudiante]);

  useEffect(() => {
    const fetchAñoBrigada = async () => {
      const response = await axios.get(
        `http://localhost:3000/auth/brigadas/${params.idBrigada}`
      );
      const data = response.data;
      const año = data[0].año_brigada;
      let array = [];
      for (let i = 1; i <= año; i++) {
        array.push(i);
      }
      setAñoBrigada(array);
    };

    fetchAñoBrigada();
  }, [params.idBrigada]);

  useEffect(() => {
    // Obtener notas según el año seleccionado
    const fetchNotas = async () => {
      const url = selectedAño
        ? `http://localhost:3000/auth/notas/estudiante/${params.idEstudiante}/${selectedAño}`
        : `http://localhost:3000/auth/notas/estudiante/${params.idEstudiante}`;
      const response = await axios.get(url);
      setNotas(response.data);
    };

    fetchNotas();
  }, [params.idEstudiante, selectedAño]);

  // Función para eliminar una nota
  const eliminarNota = async (id) => {
    await axios.delete(`http://localhost:3000/auth/notas/${id} `);
    setNotas(notas.filter((n) => n.id_nota !== id));
  };

  return (
    <>
      <Layout />
      <div className="container">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn mb-5 mr-5"
            onClick={() =>
              navigate(
                `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/new`
              )
            }
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
          <h5 className="mb-5">Promedio: {promedio}</h5>
          <select
            onChange={(e) => setSelectedAño(e.target.value)}
            value={selectedAño}
            className="form-select"
          >
            <option value="">Todos los años</option>

            {añoBrigada.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <table className="table caption-top">
          <caption>Lista de Notas</caption>
          <thead>
            <tr>
              <th scope="col">Notas</th>
              <th scope="col">Valor</th>
              <th scope="col" colSpan="2">
                Año
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {notas.map((n) => (
              <tr key={n.id_nota}>
                <td>{n.nombre_asignatura}</td>
                <td>{n.valor}</td>
                <td>{n.año}</td>
                <td className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn mr-5"
                    onClick={() =>
                      navigate(
                        `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/${n.id_nota}/editar`
                      )
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
                    onClick={() => eliminarNota(n.id_nota)}
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

export default Notas;
