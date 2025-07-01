import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavEst from "./components/NavEst";
// import LogoutButton from "../components/LogoutButton";

const HomeEst = () => {
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState('');
  const params = useParams();

  useEffect(() => {
    // Obtener promedio
    const fetchPromedio = async () => {
      const response = await axios.get(
        `http://localhost:3000/auth/notas/promedio/promedio/${params.id}`
      );
      setPromedio(response.data[0].round);
    };

    fetchPromedio();
  }, [params.idEstudiante]);


  useEffect(() => {
    const fetchNotas = async () => {
      const response = await axios.get(
        `http://localhost:3000/auth/notas/estudiante/${params.id}`
      );
      setNotas(response.data);
    };

    fetchNotas();
  }, [params.id]);

  return (
    <>
      <NavEst />
      <div className="container mx-auto p-2 mt-5">
      <LogoutButton />

      <h5 className="mb-5">Promedio: {promedio}</h5>
      <div className="container">
        <table className="table caption-top">
          <caption>Lista de Notas</caption>
          <thead>
            <tr>
              <th scope="col">Asignaturas</th>
              <th scope="col">Valor</th>
              <th scope="col">Año</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {notas.map((n) => (
              <tr key={n.id_nota}>
                <td>{n.nombre_asignatura}</td>
                <td>{n.valor}</td>
                <td>{n.año}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};

export default HomeEst;
